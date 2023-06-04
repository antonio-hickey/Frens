export interface ExtractedImgLinks {
	txtContent: string,
	imgLinks: string[],
}

export function extractImageLinks(textContent: string): ExtractedImgLinks {
	/* F(x) to extract image links within text content data */

	const tmpTxtContent = textContent.replaceAll("\n", " ");
	const imgExtensions = ["png", "jpg", "jpeg", "webp", "gif"];
	const words = tmpTxtContent.split(" ");
	let imgLinks: string[] = [];

	for (let i = 0; i < words.length; i++) {
		if (words[i].slice(0, 4) != "http") continue;

		const subWords = words[i].split(".");
		const ext = subWords[subWords.length - 1];

		if (imgExtensions.includes(ext)) {
			imgLinks.push(words[i]);
		} else {
			continue
		};

		textContent = textContent.replaceAll(words[i], "");
	}

	return {
		txtContent: textContent,
		imgLinks,
	}
}
