# if [[ -n $(git status --porcelain) ]]; then echo "repo is not checked in fully. Try again."; exit 1; fi
rm -rf dist/*
grunt

aws s3 sync --profile=nescaum dist/ s3://ny-map-nescaum-ccsc-dataservices/ --acl public-read

aws cloudfront create-invalidation --profile=nescaum --distribution-id EOXGK72MHDM86 --paths "/*"
rm -rf dist/*
