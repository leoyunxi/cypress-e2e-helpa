describe('2.捜索者位置表示TOP画面', () => {
    class indexGroupPageObj {
        visit() {
            cy.visit('/index_group.html');
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

        get groupBtn() {
            return cy.get('.group_img > a');
        }

    }

    // ページオブジェクトインスタンス作成
    const p = new indexGroupPageObj();

    before(function () {

        cy.fixture('display_constant').as('constant');
        cy.wrap(this.constant);

        p.visit();
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/index_group.html');
        })

        cy.screenshot({capture: "runner", overwrite: true});
    });

    // ページをリロードする
    afterEach(() => {
        cy.screenshot({capture: "runner", overwrite: true});

        p.visit();
        cy.location('pathname').should('include', 'index_group.html');
    });

    it('1-6', function () {
        // 設計書と同じ画面であること
        p.label.should('contain.text', this.constant.indexGroupLabel);
        p.helpaImg.should('exist');
        p.sbLogoImg.should('exist');
        p.psdLogoImg.should('exist');
        p.settingBtn.should('exist');
        p.userListBtn.should('exist');
        p.groupBtn.should('exist');
        p.callBtn.should('exist');
        p.searchBtn.should('exist');
    });

    it('1-7', function () {
        p.settingBtn.click();

        // マップ初期位置登録画面に画面遷移すること
        cy.location('pathname').should('include', 'setting.html');
    });

    it('1-8', function () {
        p.userListBtn.click();

        // 捜索者情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'customer_searcher.html');
    });

    it('1-9', function () {
        p.groupBtn.click();

        // グループ一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'group_list.html');
    });

    it('1-10', function () {
        p.callBtn.click();

        // 自動通話画面に画面遷移すること
        cy.location('pathname').should('include', 'auto_call.html');
    });

    it('1-11', function () {
        p.searchBtn.click();

        // 端末探索画面(捜索)に画面遷移すること
        cy.location('pathname').should('include', 'map.html');
    });
});