import json
import sys
import scrapy
import chompjs
from scrapy.crawler import CrawlerProcess
from scrapy.http import Request

class TrendyolSpider(scrapy.Spider):
    name = 'trendyol_spider'

    def __init__(self, product_url=None, **kwargs):
        super().__init__(**kwargs)
        self.start_urls = [product_url] if product_url else []

        # Load Puppeteer cookies if available
        try:
            with open("trendyol_cookies.json", "r", encoding="utf-8") as f:
                cookies = json.load(f)
            self.cookies = {c["name"]: c["value"] for c in cookies}
            self.logger.info(f"Loaded {len(self.cookies)} cookies from trendyol_cookies.json")
        except FileNotFoundError:
            self.cookies = {}
            self.logger.warning("No trendyol_cookies.json found. Run Puppeteer script first.")

    def start_requests(self):
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }

        for url in self.start_urls:
            yield Request(url, headers=headers, cookies=self.cookies, callback=self.parse)

    def parse(self, response):
        self.logger.info(f"Fetching URL: {response.url}")
        self.logger.info(f"Status Code: {response.status}")

        # Check if still redirected to select-country
        if "select-country" in response.url:
            self.logger.error("❌ Still stuck at select-country page.")
            yield {'error': 'Still redirected to select-country', 'url': response.url}
            return

        json_ld = response.xpath("//script[contains(@type,'application/ld+json')]/text()").get()
        data_ld = {}
        if json_ld:
            try:
                data_ld = json.loads(json_ld)
            except Exception as e:
                self.logger.error(f"JSON-LD parse error: {e}")

        image = data_ld.get('image')
        title = data_ld.get('name') or ""
        brand = data_ld.get('brand', {}).get('name') if isinstance(data_ld.get('brand'), dict) else data_ld.get('brand')
        offers = data_ld.get('offers', {})
        price = offers.get('price') if isinstance(offers, dict) else None
        discount_price = None
        category = data_ld.get('category')

        all_info = response.xpath("//script[contains(text(),'productGroupId')]/text()").get()
        if not all_info:
            yield {
                'category': category,
                'product_name': title,
                'price': price,
                'discount_price': discount_price,
                'brand': brand,
                'image': image,
                'warning': 'productGroupId not found (possibly overlay still active)'
            }
            return

        try:
            product_json = chompjs.parse_js_object(all_info)
            product_id = product_json['product']['productGroupId']
            variant_url = f"https://public.trendyol.com/discovery-web-productgw-service/api/productGroup/{product_id}"
        except Exception as e:
            yield {
                'category': category,
                'product_name': title,
                'price': price,
                'brand': brand,
                'image': image,
                'error': str(e)
            }
            return

        yield Request(
            url=variant_url,
            callback=self.parse_variants,
            meta={
                'category': category,
                'product_name': title,
                'price': price,
                'discount_price': discount_price,
                'brand': brand,
                'image': image
            }
        )

    def parse_variants(self, response):
        try:
            data = json.loads(response.text)
            attributes = data.get('result', {}).get('slicingAttributes', [])
            renk = attributes[0]['attributes'] if attributes else []
        except Exception as e:
            renk = []

        yield {
            'category': response.meta.get('category'),
            'product_name': response.meta.get('product_name'),
            'price': response.meta.get('price'),
            'discount_price': response.meta.get('discount_price'),
            'brand': response.meta.get('brand'),
            'image': response.meta.get('image'),
            'variants': renk
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Missing product URL'}))
        sys.exit(1)

    product_url = sys.argv[1]
    process = CrawlerProcess(settings={
        "LOG_LEVEL": "INFO",
        "FEEDS": {"stdout:": {"format": "json"}},
    })
    process.crawl(TrendyolSpider, product_url=product_url)
    process.start()
