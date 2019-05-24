import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalDirective } from 'angular-bootstrap-md';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-vdo',
  templateUrl: './vdo.component.html',
  styleUrls: ['./vdo.component.scss']
})
export class VdoComponent implements OnInit {
  @ViewChild('basicModal') demoBasic: ModalDirective;
  constructor(private sanitizer: DomSanitizer, public dialog: MatDialog) { }

  animal: string;
  name: string;

  ngOnInit() {
  }
  getEmbedUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/SHG_RQml_lc');
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(dialog, {
      width: '100vw',
      height: '100vh',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
  shows() {
    this.demoBasic.show();
  }
}
@Component({
  selector: 'dialog',
  templateUrl: 'dialog.html',
})
export class dialog {

  constructor(
    public dialogRef: MatDialogRef<dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private sanitizer: DomSanitizer) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  getEmbedUrls() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/SHG_RQml_lc');
  }
}
