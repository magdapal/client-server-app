import { ClientServerAppPage } from './app.po';

describe('client-server-app App', function() {
  let page: ClientServerAppPage;

  beforeEach(() => {
    page = new ClientServerAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
