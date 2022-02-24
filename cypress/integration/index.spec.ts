import type = Mocha.utils.type;

describe('1.遭難者位置表示TOP画面', () => {
    class PageObj {
        visit() {
            cy.visit('/index.html');
        }

        get label() {
            return cy.get('label');
        }

        get helpaImg() {
            return cy.get('.helpa_img');
        }

        get sbLogoImg() {
            return cy.get('.sb_logo_img');
        }

        get psdLogoImg() {
            return cy.get('.psd_logo_img');
        }

        get settingBtn() {
            return cy.get('.setting_img > a');
        }

        get userListBtn() {
            return cy.get('.regist_img > a');
        }

        get callBtn() {
            return cy.get('.call_img > a');
        }

        get searchBtn() {
            return cy.get('.search_img > a');
        }

    }

    // ページオブジェクトインスタンス作成
    const p = new PageObj();

    before(function () {
        cy.fixture('display_constant').as('constant');
        cy.wrap(this.constant);

        p.visit();
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/index.html');
        })
        cy.screenshot({capture: "runner", overwrite: true});
    });

    // ページをリロードする
    afterEach(() => {
        cy.screenshot({capture: "runner", overwrite: true});

        cy.visit('/index.html');
        cy.reload();
    });

    it('1-1', function () {
        // 設計書と同じ画面であること
        p.label.should('contain.text', this.constant.indexLabel);
        p.helpaImg.should('exist');
        p.sbLogoImg.should('exist');
        p.psdLogoImg.should('exist');
        p.settingBtn.should('exist');
        p.userListBtn.should('exist');
        p.callBtn.should('exist');
        p.searchBtn.should('exist');
    });

    it('1-2', function () {
        p.settingBtn.click();

        // マップ初期位置登録画面に画面遷移すること
        cy.location('pathname').should('include', 'setting.html');
    });

    it('1-3', function () {
        p.userListBtn.click();

        // お客様情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'customer.html');
    });

    it('1-4', function () {
        p.callBtn.click();

        // 自動通話画面に画面遷移すること
        cy.location('pathname').should('include', 'auto_call.html');
    });

    it('1-5', function () {
        p.searchBtn.click();

        // 端末探索画面(遭難)に画面遷移すること
        cy.location('pathname').should('include', 'map.html');
    });
});