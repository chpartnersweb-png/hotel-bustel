# HOTEL BUSTEL SEO設定

更新：2026-10-26（日本時間）

## 正規URL

https://hotel-bustel.pages.dev/

URLは `src/data/site.mjs` で管理し、Astroのsite設定、canonical、OG URL、構造化データ、robots.txt、サイトマップで共通利用する。

## 実装内容

- `src/components/Seo.astro` にメタ情報を集約。既存の重複するタグと単体のHotel JSON-LDは置き換え。
- title：`HOTEL BUSTEL（ホテルバステル）｜横浜・黄金町駅徒歩5分`
- description：施設名の英語・日本語表記、横浜市中区・伊勢佐木町、黄金町駅徒歩5分、全20室、客室・料金・アクセス・予約導線を説明。
- canonicalとog:urlはクエリやアンカーを含めず、上記の正規URLに統一。
- robotsメタは `index, follow, max-image-preview:large`。
- OGP・X/Twitterカードに画像と代替テキストを設定。画像URLは絶対URL。
- 共有画像は提供素材 `src/assets/IMG_3284.JPG` の実際の客室写真。AstroのgetImageで1200×630pxのJPEGをビルド時に生成する設定。生成ヒーローを施設の実写として構造化データに登録していない。
- JSON-LDはHotel・WebSite・WebPage・ImageObjectを@idで関連付け。施設名、別表記、住所、電話、20室、予約先ページ、地図、客室画像を記載。
- フロント対応時間は「22時頃」という概数のため、ホテル全体の厳密なopeningHoursには変換していない。
- 料金の宿泊単位・税区分・対象人数は未確定のため、Offer・priceRangeを追加していない。未確認の緯度経度・郵便番号・星評価・口コミ集計も追加していない。
- `src/pages/robots.txt.ts` が `/robots.txt` を静的出力し、全体のクロール許可とサイトマップの場所を記載。
- `src/pages/sitemap.xml.ts` が `/sitemap.xml` を静的出力。正規トップページ1件のみを登録し、アンカー・画像・生成エンドポイントをページとして追加しない。架空の更新日時は設定しない。

## 確認・公開の状態

ユーザーの「実装後の確認は自分で行うので不要です」という指定に従い、変更後のビルド・型チェック・テスト・ブラウザ確認・公開先の再取得・構造化データテストは実施していない。共有画像とrobots.txt・sitemap.xmlの生成結果も未確認。

実装前にWeb取得ツールで公開URLの読み込みを試みたが取得できなかったため、公開中サイトのメタ情報・HTTP状態・インデックス状態は確認できていない。サイトが停止していることを示す結果ではない。

この作業はローカルソースの変更。デプロイ、Google Search Consoleへの登録・サイトマップ送信・インデックス登録リクエストは実施していない。

## 公開反映後にユーザーが確認できる項目

1. `/` のcanonical・og:urlが `https://hotel-bustel.pages.dev/` であること。
2. `/robots.txt` と `/sitemap.xml` にアクセスでき、正規URLが記載されていること。
3. ページのog:imageの絶対URLで客室のJPEG画像が開くこと。
4. Google Search Consoleで対象サイトの所有権を確認し、`https://hotel-bustel.pages.dev/sitemap.xml` を送信すること。
5. リッチリザルトテスト・URL検査で公開版の取得と構造化データを確認すること。

## 実装時の参照

- Astro site設定：https://docs.astro.build/en/reference/configuration-reference/#site
- Astroルーティング：https://docs.astro.build/en/guides/routing/
- Astro画像処理：https://docs.astro.build/en/guides/images/
- Google canonical：https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google LocalBusiness：https://developers.google.com/search/docs/appearance/structured-data/local-business
- Googleサイトマップ：https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
