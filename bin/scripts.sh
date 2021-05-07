cd /home/ubuntu/billmaher/

aws s3 cp ./public/index.html s3://billmaher.finance/index.html --acl public-read --content-type "text/html; charset=utf-8"
aws s3 sync ./public/images s3://billmaher.finance/images --acl public-read
aws s3 cp ./public/favicon.ico s3://billmaher.finance/favicon.ico --acl public-read --content-type "image/vnd.microsoft.icon"

aws cloudfront create-invalidation --distribution-id E3LNJRJ62E3FWF --paths "/*"
