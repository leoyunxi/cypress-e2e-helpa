/// <reference path="../support/index.d.ts" />
/// <reference types="cypress" />
// @ts-ignore
const groups = require('../fixtures/group_data.json')

describe('7.グループ情報登録画面', () => {
    class PageObj {
        visit() {
            cy.visit('/group_new.html');
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

    // ページをリロードする
    beforeEach(() => {
        cy.fixture('display_constant.json').as('constant');
        cy.fixture('user_data.json').as('users');

        p.visit();
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/group_new.html');
        });
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

    it('1-42', function () {
        // 設計書と同じ画面であること
        p.titleLeft.should('contain.text', this.constant.groupNewTitle);
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

    it('1-43', function () {

        const user143 = groups.user143;

        //テストユーザーを追加
        cy.insertSearcher(user143);

        //チェック
        cy.checkNotGroupUser(user143.phone);

        //追加ボタンクリック
        p.insertBtn.click();

        // チェックを入れた捜索者がグループのリストに表示されることを確認
        cy.get('table.group').within(() => {
            cy.contains(user143.phone)
        });
    });

    it('1-44', function () {

        const user144 = groups.user144;

        //テストユーザーを追加
        cy.insertSearcher(user144);

        //チェック
        cy.checkNotGroupUser(user144.phone);

        //追加ボタンクリック
        p.insertBtn.click();

        //チェック
        cy.checkGroupUser(user144.phone);

        //削除ボタンクリック
        p.removeBtn.click();

        // チェックを入れた捜索者が非グループのリストに表示されることを確認
        cy.get('table.notGroup').within(() => {
            cy.contains(user144.phone)
        });
    });

    it('1-45', function () {
        const group = groups.group145;

        //テストユーザーを追加
        cy.insertSearchGroup(group);

        //グループ名入力
        p.groupNameInput.type(group.name);

        //キャンセルを押す
        p.cancelBtn.click();

        //変換がないこと
        cy.contains(group.name).should('not.exist');

    });


    it('1-46', function () {
        const group = groups.group146;
        const user = groups.user146;

        //テストデータを追加
        cy.insertSearcher(user);

        //チェックユーザー
        cy.checkNotGroupUser(user.phone);

        //追加ボタンクリック
        p.insertBtn.click();

        //グループ名入力
        p.groupNameInput.type(group.name);

        //登録を押す
        p.registBtn.click();

        //グループが登録されること
        cy.contains(group.name);
    });


    it('1-47', function () {
        const group = groups.group147;
        const user = groups.user147;

        //テストデータを追加
        cy.insertSearcher(user);

        //チェックユーザー
        cy.checkNotGroupUser(user.phone);

        //追加ボタンクリック
        p.insertBtn.click();

        //グループ名入力
        p.groupNameInput.type(group.name);

        //登録を押す
        p.registBtn.click();

        //グループが登録されること
        cy.contains('cy-group147LMNOPQRSTUVWXYZABC…');
    });

    it('1-48', function () {
        const group = groups.group148;
        const user = groups.user148;

        //テストデータを追加
        cy.insertSearcher(user);

        //チェックユーザー
        cy.checkNotGroupUser(user.phone);

        //追加ボタンクリック
        p.insertBtn.click();

        //グループ名を空にする
        //登録を押す
        p.registBtn.click();

        //エラーダイアログが表示されること
        cy.on("window:alert", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.inputGroupNameMsg);
        });

    });



});
