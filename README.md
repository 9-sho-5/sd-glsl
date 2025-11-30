# GLSL Demo Gallery

GLSLを用いた視覚表現デモのギャラリーサイトです。

## デモ一覧

- **Particle** - パーティクルエフェクト
- **Particle Sphere** - 球体パーティクル
- **Particle Wave** - 波形パーティクル
- **Particle Cube** - キューブパーティクル
- **Particle Wormhole** - ワームホールパーティクル
- **Particle Image** - 画像パーティクル
- **Particles Torus** - トーラスパーティクル
- **Cube Sphere** - キューブ球体
- **Cube Rolling** - 回転キューブ
- **Cube Room** - キューブルーム
- **Metal** - メタル表現
- **Glitch Scanline** - スキャンラインエフェクト
- **Glitch RGB Shift** - RGBシフトエフェクト
- **Glitch Block** - ブロックグリッチ

## ディレクトリ構成

```
.
├── archive/          # 各デモプロジェクト
│   ├── particle/
│   ├── particle-sphere/
│   └── ...
├── assets/           # 共通アセット
├── js/
│   ├── main.js           # メインスクリプト
│   ├── cube-room.js      # ファーストビュー用
│   └── generate-index.js # index.html自動生成スクリプト
├── index.html        # ギャラリートップページ（自動生成）
├── style.css         # スタイル
└── package.json
```

## スクリプト

### テンプレートからデモを作成

```bash
npm run generate -- create <demo-name>
```

`archive/<demo-name>/` にテンプレートファイルが生成されます。

### index.html の自動生成

```bash
npm run generate
```

`archive/` 配下のデモを読み取り、トップページを更新します。

## セットアップ

```bash
npm install
```

## ローカルでの確認

```bash
npx serve
```

## 新しいデモの追加方法

```bash
# 1. テンプレートを作成
npm run generate -- create my-demo

# 2. シェーダーを編集
#    archive/my-demo/fragment.glsl

# 3. トップページを更新
npm run generate
```

### テンプレートの構成

| ファイル | 説明 |
|---------|------|
| `index.html` | HTMLエントリーポイント |
| `main.js` | Three.js セットアップ（uTime, uMouse, uResolution） |
| `vertex.glsl` | 頂点シェーダー |
| `fragment.glsl` | フラグメントシェーダー（ここを編集） |

## ライセンス

&copy; Hosho Kusunose
