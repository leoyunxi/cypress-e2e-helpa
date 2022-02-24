/// <reference path="../support/index.d.ts" />
/// <reference types="cypress" />
// @ts-ignore
const groups = require('../fixtures/group_data.json')

describe('8.グループ情報編集画面', () => {
    class PageObj {
        visit() {
            cy.visit('/group_editing.html');
        }

        get titleLeft() {
            return cy.get('.title_left');
        }

        get insertBtn() {
            return cy.get('#insert');
        }

        get removeBtn() {
            return cy.get('#removal');
        }

        get cancelBtn() {
            return cy.get('#cancel');
        }

        get registBtn() {
            return cy.get('#regist');
        }

        get changeBtn() {
            return cy.get('#change');
        }

        get groupNameInput() {
            return cy.get('input[name="group_name"]');
        }

        get deleteBtn() {
            return cy.get('#delete');
        }

        get searchBtn() {
            return cy.get('#emergency_btn');
        }

        get backBtn() {
            return cy.get('.backbutton');
        }

    }

    // ページオブジェクトインスタンス作成
    const p = new PageObj();

    before(() => {
        //テストデータを追加
        cy.insertSearcher(groups.userFree);
        cy.insertSearchGroup(groups.group149);
        cy.insertSearcher(groups.user149);
        cy.insertSearchGroup(groups.group150);
        cy.insertSearcher(groups.user150);
        cy.insertSearchGroup(groups.group151);
        cy.insertSearcher(groups.user151);
        cy.insertSearchGroup(groups.group152);
        cy.insertSearchGroup(groups.group153);
        cy.insertSearcher(groups.user153);
        cy.insertSearchGroup(groups.group154);
        cy.insertSearchGroup(groups.group155);
        cy.insertSearchGroup(groups.group156);
        cy.insertSearchGroup(groups.group157);

        cy.addGroupUser(groups.user149, groups.group149);
        cy.addGroupUser(groups.user151, groups.group151);
    });

    // ページをリロードする
    beforeEach(() => {
        cy.fixture('display_constant.json').as('constant');
        cy.fixture('user_data.json').as('users');

        cy.visit('/group_list.html');
        cy.screenshot({capture: "runner", overwrite: true});
    });

    afterEach(() => {
        cy.screenshot({capture: "runner", overwrite: true});
    })

    after(function () {
        // テストデータをクリア
        cy.task("query", {
            sql: `
            DELETE FROM "searchGroup_ex" WHERE "group" LIKE $1 ;
            `,
            values: ['cy-group%']
        }).then(res => {
            cy.reload()
            // @ts-ignore
            cy.log(`rows: ${res.rows.length}`)
        });

        cy.task("query", {
            sql: `
            DELETE FROM "searchAccount_ex" WHERE "userName" LIKE $1 ;
            `,
            values: ['cy-user%']
        }).then(res => {
            cy.reload()
            // @ts-ignore
            cy.log(`rows: ${res.rows.length}`)
        })
    });

    it('1-49', function () {
        //グループを選択
        const group = groups.group149;
        cy.checkGroup(group.name);
        cy.get('#change').click();

        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/group_editing.html');
        });

        // 設計書と同じ画面であること
        p.titleLeft.should('contain.text', this.constant.groupEditTitle);
        cy.contains('グループ名');
        cy.contains('非グループ');
        cy.contains('お名前');
        cy.contains('電話番号');
        cy.contains('所属');

        p.insertBtn.should('exist');
        p.removeBtn.should('exist');
        p.cancelBtn.should('exist');
        p.removeBtn.should('exist');
    });

    it('1-50', function () {
        const group = groups.group150;
        const user = groups.user150;

        //グループを選択
        cy.checkGroup(group.name);
        cy.get('#change').click();

        //チェック
        cy.checkNotGroupUser(user.phone);

        //追加ボタンクリック
        p.insertBtn.click();

        // チェックを入れた捜索者がグループのリストに表示されることを確認
        cy.get('table.group').within(() => {
            cy.contains(user.phone)
        });
    });

    it('1-51', function () {
        const group = groups.group151;
        const user = groups.user151;

        //グループを選択
        cy.checkGroup(group.name);
        cy.get('#change').click();

        //チェック
        cy.checkGroupUser(user.phone);

        //ボタンクリック
        p.removeBtn.click();

        // チェックを入れた捜索者がグループのリストに表示されることを確認
        cy.get('table.notGroup').within(() => {
            cy.contains(user.phone)
        });
    });

    it('1-52', function () {
        const group = groups.group152;

        //グループを選択
        cy.checkGroup(group.name);
        cy.get('#change').click();

        //Cancelボタンクリック
        p.cancelBtn.click();

        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/group_list.html');
        });

        //キャンセル前後変化がないこと
        cy.contains(group.name)
            .parent()
            .children()
            .then(($lis) => {
                expect($lis.eq(1), 'グループ名').to.have.text(group.name)
                expect($lis.eq(2), 'グループ人数').to.contain(group.members.length)
            })

    });

    it('1-53', function () {
        const group = groups.group153;
        const user = groups.user153;

        //グループを選択
        cy.checkGroup(group.name);
        cy.get('#change').click();

        //グループ名を入力
        p.groupNameInput.clear();
        p.groupNameInput.type(group.nameDelta)

        //ユーザーをグループに登録
        cy.checkNotGroupUser(user.phone);

        //追加ボタンクリック
        cy.get('#insert').click();

        //登録ボタンクリック
        p.registBtn.click();

        //正常に登録されること
        cy.contains(group.name)
            .parent()
            .children()
            .then(($lis) => {
                expect($lis.eq(1), 'グループ名').to.have.text(group.nameDelta)
                expect($lis.eq(2), 'グループ人数').to.contain(1)
            })

    });


    it('1-54', function () {
        const group = groups.group154;

        //グループを選択
        cy.checkGroup(group.name);
        cy.get('#change').click();

        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/group_editing.html');
        });

        //グループ名を入力
        p.groupNameInput.clear();
        p.groupNameInput.type(group.nameDelta)


        //登録ボタンクリック
        p.registBtn.click();

        //正常に登録されること
        cy.contains(group.name)
            .parent()
            .children()
            .then(($lis) => {
                expect($lis.eq(1), 'グループ名').to.have.text(group.nameExpect)
                expect($lis.eq(2), 'グループ人数').to.contain(group.members.length)
            })

    });

    it('1-55', function () {
        const group = groups.group155;

        //グループを選択
        cy.checkGroup(group.name);
        cy.get('#change').click();

        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/group_editing.html');
        });

        //ユーザー選択なしで追加ボタンを押す
        p.insertBtn.click();

        //エラーダイアログが表示されること
        cy.on("window:alert", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.selectGroupUserMsg);
        });

    });

    it('1-56', function () {
        const group = groups.group156;

        //グループを選択
        cy.checkGroup(group.name);
        cy.get('#change').click();

        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/group_editing.html');
        });

        //ユーザー選択なしで削除ボタンを押す
        p.removeBtn.click();

        //エラーダイアログが表示されること
        cy.on("window:alert", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.selectGroupUserMsg);
        });

    });


    it('1-57', function () {
        const group = groups.group155;

        //グループを選択
        cy.checkGroup(group.name);
        cy.get('#change').click();

        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/group_editing.html');
        });

        //グループ名を入力なしにする
        p.groupNameInput.clear();

        //登録ボタンクリック
        p.registBtn.click();

        //エラーダイアログが表示されること
        cy.on("window:alert", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.inputGroupNameMsg);
        });

    });



});
