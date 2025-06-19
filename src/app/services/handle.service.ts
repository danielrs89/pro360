import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HandleService {
  isCreate: boolean;
  isEdit: boolean;

  constructor() {
    this.isCreate = false;
    this.isEdit = false;
  }

  handleCreate(isCreate: boolean) {
    this.isCreate = isCreate;
  }
  handleEdit(isEdit: boolean) {
    this.isEdit = isEdit;
  }
}
