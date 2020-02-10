grunt

echo '
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <title>NY CCC Map</title>
          <meta http-equiv="refresh" content="0;URL='/ny-ccc-map/dist/index.html'" />
            </head>
              <body></body>
</html>' > index.html
git add -f dist/* index.html

git commit -m "Releasing"
echo "Pushing to gh-pages"
git push -f origin `git rev-parse --symbolic-full-name --abbrev-ref HEAD`:gh-pages
echo "Going backward one revision"
git reset --hard HEAD~1

echo "https://caryfitzhugh.github.io/ny-ccc-map/"
