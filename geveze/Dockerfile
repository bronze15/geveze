FROM guneysu/python2:onbuild
EXPOSE 8000
ADD / /geveze
WORKDIR /
CMD python -Wall -m geveze --logging=debug --autoreload=true --debug=false
