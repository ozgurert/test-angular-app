import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OzgurComponent } from './ozgur.component';

describe('OzgurComponent', () => {
  let component: OzgurComponent;
  let fixture: ComponentFixture<OzgurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OzgurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OzgurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
