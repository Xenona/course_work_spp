export class WrappingFactory<
  FROM extends { new (...args: any): any },
  TO extends { new (f: any): any }
> {
  registry: Map<FROM, TO> = new Map()

  register(fromClass: FROM, toClass: TO) {
    this.registry.set(fromClass, toClass)
  }

  construct(from: InstanceType<FROM>): InstanceType<TO> {
    for (const [fromClass, toClass] of this.registry.entries()) {
      if (Object.getPrototypeOf(from) === fromClass.prototype) {
        return new toClass(from)
      }
    }
    throw new Error('No constructor found for ' + from.constructor.name)
  }
}
