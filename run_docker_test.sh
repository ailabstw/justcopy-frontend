#! bin/bash
docker run -v /volume/justcopy-staging/posts:/_posts -v /home/howard/docker/justcopy_frontend_mobile/containers:/jekyll -p 4124:4000 -it justcopy_frontend_mobile_test /bin/bash
