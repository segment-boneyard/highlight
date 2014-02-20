
build: components lib/*
	@component build --dev

clean:
	@rm -rf build components

components: component.json
	@component install --dev

test: build
	@component test phantom

.PHONY: clean test