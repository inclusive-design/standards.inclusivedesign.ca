// Based on download tracking script from https://docs.umami.is/docs/guides/track-file-downloads
document.addEventListener('DOMContentLoaded', () => {
	const fileExtensions = /\.(pdf|zip|tar|gz|rar|doc|docx|xls|xlsx|ppt|pptx|csv|mp3|mp4|dmg|exe|iso)$/iv;
	const anchors = document.querySelectorAll('a[href]');

	for (const anchor of anchors) {
		if (fileExtensions.test(anchor.href) && !anchor.dataset.dataUmamiEvent) {
			const filename = anchor.href.split('/').pop().split('?')[0];
			anchor.dataset.umamiEvent = 'file-download';
			anchor.dataset.umamiEventFile = filename;
		}
	}
});
