console.log('doucment', document);

const templateElement = document.createElement('template');
templateElement.innerHTML = `
    <style>
    :host > div {
           border: 1px solid red; 
        }

        ::slotted(h2) {
            color: purple;
        }

        div {
            color: var(--counter-color, green);
        }
        h2 {
            color: green;
        }
    </style>
<slot name="title"></slot>
<slot name="decrease"><button type="button">-</button></slot>
<div id="value">0</div>
<slot name="increase"><button type="button">+</button></slot>
EXTRAS:
<slot></slot>`;

const template = templateElement.content;


class MyCounter extends HTMLElement {
    constructor() {
        super();
        console.log('MyCounterElement Created', this);
        const shadow = this.attachShadow({
            mode: 'open'
        });
        shadow.appendChild(template.cloneNode(true));

        const increaseSlot = shadow.querySelector('slot[name=increase]');
        //                console.log(increaseSlot, Object.getPrototypeOf(increaseSlot).constructor.name);
        [...increaseSlot.assignedNodes(), ...increaseSlot.children]
        .filter(element => element instanceof HTMLButtonElement)
            .forEach(button => button.addEventListener('click', this.onIncrease.bind(this)));

        const decreaseSlot = shadow.querySelector('slot[name=decrease]');
        [...decreaseSlot.assignedNodes(), ...decreaseSlot.children]
        .filter(element => element instanceof HTMLButtonElement)
            .forEach(button => button.addEventListener('click', this.onDecrease.bind(this)));

        this.valueNode = shadow.querySelector("#value");
        this.value = 0;
    }

    onIncrease() {
        this.value++;
    }

    onDecrease() {
        this.value--;
    }

    set value(newValue) {
        this.valueNode.textContent = '' + newValue;
        this._value = newValue;
    }

    get value() {
        return this._value;
    }


}

customElements.define('my-counter', MyCounter);