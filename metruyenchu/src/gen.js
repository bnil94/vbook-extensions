function execute(url, page) {
    if (!page) page = '1';
    let browser = Engine.newBrowser();
    browser.setUserAgent(UserAgent.android());

    browser.block([".*?api.truyen.onl/v2/books\\?sort_by.*?"]);

    browser.launchAsync(url + "&page=" + page);
    browser.waitUrl(".*?api.truyen.onl/v2/books\\?sort_by.*?", 10000);
    browser.close()

    var urls = JSON.parse(browser.urls());
    var novelList = [];
    var next = "";
    urls.forEach(requestUrl => {
        if (requestUrl.indexOf("api.truyen.onl/v2/books") >= 0) {
            let response = fetch(requestUrl, {
                headers: {
                    'user-agent': UserAgent.android()
                }
            }).json();
            next = response._extra._pagination._next;
            response._data.forEach(book => {
                novelList.push({
                    name: book.name,
                    link: "/truyen/" + book.slug,
                    description: book.author_name,
                    cover: book['poster']['default'],
                    host: "https://metruyencv.com"
                })
            });
        }
    });
    return Response.success(novelList, next);
}