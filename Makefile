# デフォルトのMarkdownファイル
TARGET ?= slide.md

.DEFAULT_GOAL := help
.PHONY: all pdf html index preview help fig fig-svg

all: pdf html

# PDFに変換するターゲット
# make pdf TARGET=another_slide.md のように実行できる
pdf:
	npx @marp-team/marp-cli $(TARGET) --pdf -o $(TARGET:.md=.pdf) --allow-local-files

# HTMLに変換するターゲット
# make html TARGET=another_slide.md のように実行できる
html:
	npx @marp-team/marp-cli $(TARGET) --html -o $(TARGET:.md=.html) --allow-local-files

index:
	npx @marp-team/marp-cli $(TARGET) --html -o index.html --allow-local-files

# fig/ディレクトリのmermaid mdをsvgに変換
fig:
	@for f in fig/*.md; do \
		echo "Converting $$f to SVG..."; \
		npx -p @mermaid-js/mermaid-cli mmdc -i "$$f" -o "$${f%.md}.svg"; \
		mv "$${f%.md}-1.svg" "$${f%.md}.svg"; \
	done

# 単一のmermaid mdをsvgに変換
fig-svg:
ifndef FIG
	$(error FIG is required. Usage: make fig-svg FIG=fig/c.md)
endif
	npx -p @mermaid-js/mermaid-cli mmdc -i $(FIG) -o $(FIG:.md=.svg)
	mv $(FIG:.md=-1.svg) $(FIG:.md=.svg)


# プレビューするターゲット
# make preview TARGET=another_slide.md のように実行できる
preview:
	npx @marp-team/marp-cli $(TARGET) --preview

help:
	@echo "使い方:"
	@echo "  make pdf                           $(TARGET) をPDFに変換"
	@echo "  make html                          $(TARGET) をHTMLに変換"
	@echo "  make index                         $(TARGET) をHTMLに変換しindex.htmlに反映"
	@echo "  make preview                       $(TARGET) をプレビュー"
	@echo "  make all                           $(TARGET) をPDFとHTMLに変換"
	@echo "  make <command> TARGET=<ファイル名> 任意のファイルを変換"
	@echo "  make fig                           fig/内の全mdをsvgに変換"
	@echo "  make fig-svg FIG=<file>            指定のmdをsvgに変換"
