type WaybackApiResponse = Readonly<{
  url: string,
  archived_snapshots: Readonly<{
    closest?: Readonly<{
      status: string
      available: boolean
      timestamp: string,
      url: string
    }>
  }>
}>;

chrome.runtime.onMessage.addListener(({ type, archiveUrl }, { url, tab }, sendResponse) => {
  switch (type) {
    case 'redirectToArchive': {
      if (!tab?.id) {
        return;
      }

      chrome.tabs.update(tab.id, {
        url: archiveUrl
      });

      break;
    }

    case 'findArchive':
      (async () => {
        if (!url) {
          throw new Error('');
        }

        const res = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`);
        const { archived_snapshots: { closest } }: WaybackApiResponse = await res.json();

        if (!closest || !closest.available) {
          sendResponse();

          return;
        }

        const statusCode = Number(closest.status);

        if (Number.isNaN(statusCode) || statusCode < 200 || statusCode > 299) {
          sendResponse();

          return;
        }

        sendResponse(closest.url);
      })();

      return true;
  }
});

chrome.webRequest.onCompleted.addListener(async ({
  statusCode,
  tabId
}) => {
  if (statusCode !== 404) {
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['content.js']
  });
}, {
  urls: ['<all_urls>'],
  types: ['main_frame']
});
