class Context {}

class App {
  ctx: Context;

  constructor() {
    this.ctx = new Context();
  }

  router(method?: string[]) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      console.log('first(): called');
    };
  }

  get() {}
}
