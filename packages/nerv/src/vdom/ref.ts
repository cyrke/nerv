import { isFunction, isString } from 'nerv-utils'
import { isComposite } from 'nerv-shared'

export default {
  update (lastVnode, nextVnode, domNode?) {
    const prevRef = lastVnode != null && lastVnode.props.ref
    const nextRef = nextVnode != null && nextVnode.props.ref

    if (prevRef !== nextRef) {
      this.detach(lastVnode, prevRef, lastVnode.dom)
      this.attach(nextVnode, nextRef, domNode)
    }
  },
  attach (vnode, ref, domNode: Element) {
    const node = isComposite(vnode) ? vnode.component : domNode
    if (isFunction(ref)) {
      ref(node)
    } else if (isString(ref)) {
      const inst = vnode._owner
      if (inst && isFunction(inst.render)) {
        inst.refs[ref] = node
      }
    }
  },
  detach (vnode, ref, domNode: Element) {
    const node = isComposite(vnode) ? vnode.component : domNode
    if (isFunction(ref)) {
      ref(null)
    } else if (isString(ref)) {
      const inst = vnode._owner
      if (inst.component.refs[ref] === node && isComposite(inst)) {
        delete inst.component.refs[ref]
      }
    }
  }
}