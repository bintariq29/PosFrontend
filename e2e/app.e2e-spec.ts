import { DemoProjecectTemplatePage } from './app.po';

describe('DemoProjecect App', function () {
    let page: DemoProjecectTemplatePage;

    beforeEach(() => {
        page = new DemoProjecectTemplatePage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
