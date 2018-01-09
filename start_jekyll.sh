#! bin/bash
cp lib/related_posts.rb /var/lib/gems/2.3.0/gems/jekyll-3.4.5/lib/jekyll/related_posts.rb
bundle exec jekyll serve --host 0.0.0.0 --no-watch -V
