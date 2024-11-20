import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('AppComponent', () => {
  let sqliteMock: Partial<SQLite>;

  beforeEach(async () => {
    sqliteMock = {
      create: jasmine.createSpy('create').and.returnValue(
        Promise.resolve({
          executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve()),
        })
      ),
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: SQLite, useValue: sqliteMock }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
