"""
kinukimama HTML分割スクリプト
使い方: python3 split_files.py
実行場所: /Users/hakushi/Documents/GitHub/kinukimama/
"""

import re
import os

INPUT_FILE = "index.html"
CSS_FILE = "style.css"
JS_FILE = "script.js"

def split_html():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # ── CSS抽出 ──
    css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if not css_match:
        print("❌ <style>タグが見つかりません")
        return
    css_content = css_match.group(1).strip()

    # ── JS抽出（複数の<script>タグに対応）──
    script_matches = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
    if not script_matches:
        print("❌ <script>タグが見つかりません")
        return
    js_content = "\n\n".join(s.strip() for s in script_matches)

    # ── CSS/JSを外部ファイルに保存 ──
    with open(CSS_FILE, "w", encoding="utf-8") as f:
        f.write(css_content)
    print(f"✅ {CSS_FILE} 作成完了 ({len(css_content):,} 文字)")

    with open(JS_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"✅ {JS_FILE} 作成完了 ({len(js_content):,} 文字)")

    # ── HTMLから<style>を削除し<link>に置換 ──
    new_html = re.sub(
        r'<style>.*?</style>',
        '<link rel="stylesheet" href="style.css">',
        content,
        flags=re.DOTALL
    )

    # ── HTMLから<script>を削除し</body>直前に<script src>を追加 ──
    new_html = re.sub(r'<script>.*?</script>', '', new_html, flags=re.DOTALL)
    new_html = new_html.replace(
        '</body>',
        '<script src="script.js"></script>\n</body>'
    )

    # 空白行を整理
    new_html = re.sub(r'\n{3,}', '\n\n', new_html)

    # バックアップ作成
    with open("index_before_split.html", "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ バックアップ: index_before_split.html")

    # 新しいindex.htmlを保存
    with open(INPUT_FILE, "w", encoding="utf-8") as f:
        f.write(new_html)

    print(f"✅ {INPUT_FILE} 更新完了 ({len(new_html):,} 文字)")
    print(f"\n📁 ファイル構成:")
    print(f"   index.html  ← HTML構造のみ")
    print(f"   style.css   ← 全CSS")
    print(f"   script.js   ← 全JavaScript")
    print(f"\n次のステップ: ブラウザで確認してからgit add . && git push")

if __name__ == "__main__":
    if not os.path.exists(INPUT_FILE):
        print(f"❌ {INPUT_FILE} が見つかりません。kinukimamaフォルダで実行してください。")
    else:
        split_html()