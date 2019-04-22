
echo $TRAVIS_REPO_SLUG
echo TAG: $TRAVIS_TAG
echo PR: $TRAVIS_PULL_REQUEST

packing(){
	npm install
	TRAVIS=true TAG_NAME=$TRAVIS_TAG npm run dist
}

upload(){
	# 为了不修改 ci，copy 一份
	cp -r ./release ./desktop-electron
	zip -r $TRAVIS_TAG.zip desktop-electron
	curl -v -F r=releases -F hasPom=false -F e=zip -F g=com.easemob.desktop.electron -F a=desktop-electron -F v=${TRAVIS_TAG} -F p=zip -F file=@${TRAVIS_TAG}.zip -u ci-deploy:Xyc-R5c-SdS-2Qr https://hk.nexus.op.easemob.com/nexus/service/local/artifact/maven/content
}

if [ $TRAVIS_TAG ]; then
	echo -e "\n[is a tag] start packing\n"
	packing || exit 1
	upload
else
	echo -e "\n[not a tag] exit packing\n"
fi
