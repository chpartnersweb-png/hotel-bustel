# HOTEL BUSTEL 実装記録

2026-10-26（日本時間）

## 実装内容

- Astroの初期ページを、日本語のHOTEL BUSTELのLPに置き換え。
- 全画面ヒーロー：100dvh（100svh・100vhへフォールバック）、画像を全面に配置。ヘッダーは画像に重ねる。
- ヒーローのテキストはホテル名と「横浜、伊勢佐木町に泊まる。」を中心に抑制。
- 料金、実写による客室紹介、施設案内、Googleマップと経路リンク、楽天トラベル・Trip.comの予約導線、電話リンク。
- 客室・館内の5写真を拡大表示するダイアログ。前後ボタン・矢印キー・スワイプ・Escに対応する実装。
- メニューダイアログ。予約・電話の固定ボタンはヒーロー通過後に表示し、予約セクションに入ると非表示。
- GSAP / ScrollTriggerによる登場演出と、PCの客室写真の小さなパララックス。
- PCのマウス操作でLenisを使用。タッチ操作はブラウザ標準。prefers-reduced-motionでは登場演出・パララックス・Lenisを使用しない。
- 写真・生成画像はAstroの画像処理でWebPとレスポンシブ画像を出力する設定。
- タイトル・description・基本OG情報・Hotel構造化データ・Bの文字を使ったfavicon。

## データと素材

- 名称・料金・予約URL・電話・住所・営業時間・写真情報：`src/data/hotel.ts`。
- 実写：提供JPG5点。Trip.comの透かしがあるPNG4点は使用していない。
- ヒーロー画像：`src/assets/bustel-hero-concept-v1.png`。元の案は `public/images/generated/bustel-hero-concept-v1.png` に保存。
- 生成画像には「イメージビジュアル（AI生成）」と表示。実際の施設写真として紹介していない。
- 生成プロンプト：`docs/planning/hero-image-prompt.md`。
- チェックイン14:30（最終22:00）・チェックアウト12:00は、制作計画時に参照した楽天トラベルおよびTrip.comの掲載情報に基づく。
- 料金はユーザー提供の1室9,000円／15,000円。「税込」「1泊」「〜」は加えていない。
- 公開URL未確定のためcanonical・og:url・絶対URLのOG画像・サイトマップは未設定。

## 確認状態

ユーザーの「実装後の確認は自分で行うので不要です」という指定に従い、ビルド・型チェック・テスト・開発サーバー起動・ブラウザ表示確認・スクリーンショット取得は実施していない。動作・表示・画像最適化の生成結果は未確認。公開・デプロイも行っていない。

開発サーバーを利用するときはAGENTS.mdどおり `npm run dev -- --background`。管理は `npm run astro -- dev status`、`npm run astro -- dev logs`、`npm run astro -- dev stop`。
