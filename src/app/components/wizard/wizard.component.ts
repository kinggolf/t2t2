import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css', '../../app.component.css']
})
export class WizardComponent implements OnInit {
  helpCount: number;
  nextTitle: string;

  constructor(private bottomSheetRef: MatBottomSheetRef<WizardComponent>) {}

  ngOnInit() {
    this.helpCount = 0;
    this.nextTitle = 'Next';
  }

  incrementHelp(i) {
    if (this.helpCount === 4 &&  i === 1) {
      this.bottomSheetRef.dismiss();
    }
    if (this.helpCount === 3) {
      this.nextTitle = 'Finish';
    } else {
      this.nextTitle = 'Next';
    }
    this.helpCount = this.helpCount + i;
  }
}
