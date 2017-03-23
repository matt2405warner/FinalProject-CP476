import { GameProjPage } from './app.po';

describe('game-proj App', () => {
  let page: GameProjPage;

  beforeEach(() => {
    page = new GameProjPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
