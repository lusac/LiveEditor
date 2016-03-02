run:
	@echo "access: http://localhost:8888/index.html"
	python -m SimpleHTTPServer 8888

test:
	open spec/SpecRunner.html
