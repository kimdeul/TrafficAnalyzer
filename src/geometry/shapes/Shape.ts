export class Shape {

  private ephemeral: boolean;

  constructor() {
    this.ephemeral = false;
  }

  get deleted() {
    return this.ephemeral;
  }

  delete() {
    this.ephemeral = true;
  }

}
