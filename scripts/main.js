// Classes

class Cipher {
	constructor() {
		this.input = '';
		this.output = '';
		this.name = `Cipher`;
		this.enabled = true;
	}

	run(input) {
		this.input = input;
		this.output = input;

		return input;
	}

	getName() {
		return this.name;
	}

	clone() {
		return new Cipher();
	}
}

class Group extends Cipher {
	constructor(groupSize = 5) {
		super();
		
		this.name = 'Group';
		this.groupSize = groupSize;
	}

	run(input) {
		super.run(input);

		this.output = this.group().join(' ');

		return this.output;
	}

	group() {
		var r = [];
		for (let i = 0; i < this.input.length; i += this.groupSize) {
			r.push(this.input.substring(i, i + this.groupSize));
		}
		return r;
	}

	createSettings() {
		const $container = document.createElement('div');
		$container.classList.add('input-container');

		// Group Size
		const $groupSizeGroup = document.createElement('div');
		$groupSizeGroup.classList.add('input-group');
		$container.appendChild($groupSizeGroup);

		const $groupSizeLabel = document.createElement('label');
		$groupSizeLabel.htmlFor = 'group-size-input'
		$groupSizeLabel.innerHTML = 'Group Size'
		$groupSizeGroup.appendChild($groupSizeLabel);

		const $groupSizeInput = document.createElement('input');
		$groupSizeInput.id = 'group-size-input'
		$groupSizeInput.min = '1';
		$groupSizeInput.step = '1';
		$groupSizeInput.type = 'number';
		$groupSizeInput.value = this.groupSize;
		$groupSizeInput.addEventListener('input', () => {
			this.groupSize = Number($groupSizeInput.value);
			run();
		});
		$groupSizeGroup.appendChild($groupSizeInput);

		return $container;
	}

	clone() {
		return new Group();
	}
}

class RemoveWhitespace extends Cipher {
	constructor() {
		super();
		
		this.name = 'Remove Whitespace';
	}

	run(input) {
		super.run(input);

		this.output = this.output.replace(/\s/g,'');

		return this.output;
	}

	clone() {
		return new RemoveWhitespace();
	}
}

class UpperCase extends Cipher {
	constructor() {
		super();
		
		this.name = 'Upper Case';
	}

	run(input) {
		super.run(input);

		this.output = this.output.toUpperCase();

		return this.output;
	}

	clone() {
		return new UpperCase();
	}
}

class LowerCase extends Cipher {
	constructor() {
		super();

		this.name = 'Lower Case';
	}

	run(input) {
		super.run(input);

		this.output = this.output.toLowerCase();

		return this.output;
	}

	clone() {
		return new LowerCase();
	}
}

class CamelCase extends Cipher {
	constructor() {
		super();

		this.name = 'Camel Case';
	}

	run(input) {
		super.run(input);

		const words = this.output.trim().split(' ');
		const word_count = words.length;
		for (let i = 0; i < word_count; i++) {
			if (i === 0) {
				words[i] = `${words[i].substring(0, 1).toLowerCase()}${words[i].substring(1).toLowerCase()}`;
			} else {
				words[i] = `${words[i].substring(0, 1).toUpperCase()}${words[i].substring(1).toLowerCase()}`;
			}
		}
		this.output = words.join('');

		return this.output;
	}

	clone() {
		return new CamelCase();
	}
}

class PascalCase extends Cipher {
	constructor() {
		super();

		this.name = 'Pascal Case';
	}

	run(input) {
		super.run(input);

		const words = this.output.trim().split(' ');
		const word_count = words.length;
		for (let i = 0; i < word_count; i++) {
			words[i] = `${words[i].substring(0, 1).toUpperCase()}${words[i].substring(1).toLowerCase()}`;
		}
		this.output = words.join('');

		return this.output;
	}

	clone() {
		return new PascalCase();
	}
}

class SnakeCase extends Cipher {
	constructor() {
		super();

		this.name = 'Snake Case';
	}

	run(input) {
		super.run(input);

		this.output = this.output.trim().toLowerCase().replace(/ /g,"_");

		return this.output;
	}

	clone() {
		return new SnakeCase();
	}
}

class KebabCase extends Cipher {
	constructor() {
		super();

		this.name = 'Kebab Case';
	}

	run(input) {
		super.run(input);

		this.output = this.output.trim().toLowerCase().replace(/ /g,"-");

		return this.output;
	}

	clone() {
		return new KebabCase();
	}
}

class Affine extends Cipher {
	constructor(process = processes.ENCRYPT, multiplier = 1, shift = 0) {
		super();

		this.name = 'Affine Cipher';
		this.process = process;
		this.multiplier = multiplier;
		this.shift = shift;
		this.alphabetLength = 26;
	}

	run(input) {
		super.run(input);

		if (this.process === processes.DECRYPT) {
			this.decrypt();
		} else {
			this.encrypt();
		}

		return this.output;
	}

	encrypt() {
		let output = '';
		for (let i = 0; i < this.input.length; i++) {
			let charCode = this.input.charCodeAt(i);

			output += substitute(charCode, this.multiplier, this.shift);
		}

		this.output = output;
	}

	decrypt() {
		// Find the modular multiplicative inverse
		let inverseMultiplier = 0;
		for (let i = 1; i <= this.alphabetLength; i++) {
			if (modulo(i * this.multiplier, this.alphabetLength) === 1) {
				inverseMultiplier = i;
				break;
			}
		}

		let output = '';
		for (let i = 0; i < this.input.length; i++) {
			let charCode = this.input.charCodeAt(i);

			output += substitute(charCode, inverseMultiplier, -1 * inverseMultiplier * this.shift);
		}

		this.output = output;
	}

	createSettings() {
		const $container = document.createElement('div');
		$container.classList.add('input-container');

		// Process
		const $processGroup = document.createElement('div');
		$processGroup.classList.add('input-group');
		$container.appendChild($processGroup);

		const $processLabel = document.createElement('label');
		$processLabel.htmlFor = 'process-select'
		$processLabel.innerHTML = 'Process'
		$processGroup.appendChild($processLabel);

		const $processSelect = document.createElement('select');
		$processSelect.id = 'process-select'
		$processSelect.addEventListener('change', () => {
			this.process = Number($processSelect.value);
			run();
		});
		$processGroup.appendChild($processSelect);
		
		const $encryptOption = document.createElement('option');
		$encryptOption.innerHTML = 'Encrypt';
		if (this.process === processes.ENCRYPT) {
			$encryptOption.selected = 'selected';
		}
		$encryptOption.value = processes.ENCRYPT;
		$processSelect.appendChild($encryptOption);
		
		const $decryptOption = document.createElement('option');
		$decryptOption.innerHTML = 'Decrypt';
		if (this.process === processes.DECRYPT) {
			$decryptOption.selected = 'selected';
		}
		$decryptOption.value = processes.DECRYPT;
		$processSelect.appendChild($decryptOption);

		// Multiplier
		const $multiplierGroup = document.createElement('div');
		$multiplierGroup.classList.add('input-group');
		$container.appendChild($multiplierGroup);

		const $multiplierLabel = document.createElement('label');
		$multiplierLabel.htmlFor = 'multiplier-input'
		$multiplierLabel.innerHTML = 'Multiplier'
		$multiplierGroup.appendChild($multiplierLabel);


		const $multiplierInput = document.createElement('input');
		$multiplierInput.setAttribute('aria-describedBy', 'multiplier-input-error');
		$multiplierInput.id = 'multiplier-input'
		$multiplierInput.step = '1';
		$multiplierInput.type = 'number';
		$multiplierInput.value = this.multiplier;
		$multiplierInput.addEventListener('input', () => {
			this.multiplier = Number($multiplierInput.value);
			this.validateMultiplier();
			run();
		});
		$multiplierGroup.appendChild($multiplierInput);

		const $multiplierError = document.createElement('p');
		$multiplierError.id = 'multiplier-input-error';
		$multiplierGroup.appendChild($multiplierError);

		// Shift
		const $shiftGroup = document.createElement('div');
		$shiftGroup.classList.add('input-group');
		$container.appendChild($shiftGroup);

		const $shiftLabel = document.createElement('label');
		$shiftLabel.htmlFor = 'shift-input'
		$shiftLabel.innerHTML = 'Shift'
		$shiftGroup.appendChild($shiftLabel);

		const $shiftInput = document.createElement('input');
		$shiftInput.id = 'shift-input'
		$shiftInput.step = '1';
		$shiftInput.type = 'number';
		$shiftInput.value = this.shift;
		$shiftInput.addEventListener('input', () => {
			this.shift = Number($shiftInput.value);
			run();
		});
		$shiftGroup.appendChild($shiftInput);

		return $container;
	}

	validateMultiplier() {
		// Find the modular multiplicative inverse
		let inverseMultiplier = 0;
		for (let i = 1; i <= this.alphabetLength; i++) {
			if (modulo(i * this.multiplier, this.alphabetLength) === 1) {
				inverseMultiplier = i;
				break;
			}
		}

		// If the modular multiplicative inverse doesn't exist, warn the user
		const $multiplierError = document.querySelector('#multiplier-input-error');
		if (inverseMultiplier === 0) {
			$multiplierError.innerHTML = `Warning: Multiplier must be coprime to ${this.alphabetLength}.`;
		} else {
			$multiplierError.innerHTML = '';
		}
	}

	clone() {
		return new Affine();
	}
}

class Caesar extends Affine {
	constructor(process = processes.ENCRYPT, shift = 3) {
		super(process, 1, shift);

		this.name = 'Caesar Cipher';
	}

	clone() {
		return new Caesar();
	}
}

class Atbash extends Affine {
	constructor(process = processes.ENCRYPT) {
		super(process, -1, -1);

		this.name = 'Atbash Cipher';
	}

	clone() {
		return new Atbash();
	}
}

class Keyword extends Cipher {
	constructor(process = processes.ENCRYPT, key = '') {
		super();

		this.name = 'Keyword Cipher';
		this.process = process;
		this.key = key.toUpperCase();

		this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}

	run(input) {
		super.run(input);

		this.encyptionAlphabet = this.createAlphabet();

		if (this.process === processes.DECRYPT) {
			this.decrypt();
		} else {
			this.encrypt();
		}

		return this.output;
	}

	encrypt() {
		let output = '';
		for (let i = 0; i < this.input.length; i++) {
			let charCode = this.input.charCodeAt(i);
			
			output += this.encyptionAlphabet[getCharacterNumeric(charCode)];
		}

		this.output = output;
	}

	decrypt() {
		let output = '';
		for (let i = 0; i < this.input.length; i++) {
			let index = this.encyptionAlphabet.indexOf(this.input[i]);
			
			output += this.alphabet[index];
		}

		this.output = output;
	}

	createAlphabet() {
		// Remove duplicate characters from key
		let uniqueKey = '';
		for (let i = 0; i < this.key.length; i++) {
			if (uniqueKey.indexOf(this.key[i]) === -1) {
				uniqueKey += this.key[i];
			}
		}

		// Set the first letters of the alphabet to be the unique key
		let newAlphabet = uniqueKey;

		// Add in the other characters in order
		for (let i = 0; i < this.alphabet.length; i++) {
			if (newAlphabet.indexOf(this.alphabet[i]) === -1) {
				newAlphabet += this.alphabet[i];
			}
		}

		return newAlphabet;
	}
	
	createSettings() {
		const $container = document.createElement('div');
		$container.classList.add('input-container');

		// Process
		const $processGroup = document.createElement('div');
		$processGroup.classList.add('input-group');
		$container.appendChild($processGroup);

		const $processLabel = document.createElement('label');
		$processLabel.htmlFor = 'process-select'
		$processLabel.innerHTML = 'Process'
		$processGroup.appendChild($processLabel);

		const $processSelect = document.createElement('select');
		$processSelect.id = 'process-select'
		$processSelect.addEventListener('change', () => {
			this.process = Number($processSelect.value);
			run();
		});
		$processGroup.appendChild($processSelect);
		
		const $encryptOption = document.createElement('option');
		$encryptOption.innerHTML = 'Encrypt';
		if (this.process === processes.ENCRYPT) {
			$encryptOption.selected = 'selected';
		}
		$encryptOption.value = processes.ENCRYPT;
		$processSelect.appendChild($encryptOption);
		
		const $decryptOption = document.createElement('option');
		$decryptOption.innerHTML = 'Decrypt';
		if (this.process === processes.DECRYPT) {
			$decryptOption.selected = 'selected';
		}
		$decryptOption.value = processes.DECRYPT;
		$processSelect.appendChild($decryptOption);

		// Key
		const $keyGroup = document.createElement('div');
		$keyGroup.classList.add('input-group');
		$container.appendChild($keyGroup);

		const $keyLabel = document.createElement('label');
		$keyLabel.htmlFor = 'key-input'
		$keyLabel.innerHTML = 'Key'
		$keyGroup.appendChild($keyLabel);

		const $keyInput = document.createElement('input');
		$keyInput.id = 'key-input'
		$keyInput.type = 'text';
		$keyInput.value = this.key;
		$keyInput.addEventListener('keyup', () => {
			this.key = $keyInput.value.toUpperCase();
			run();
		});
		$keyGroup.appendChild($keyInput);

		return $container;
	}

	clone() {
		return new Keyword();
	}
}

class Vigenere extends Cipher {
	constructor(process = processes.ENCRYPT, key = 'key') {
		super();

		this.name = 'Vigenère Cipher';
		this.process = process;
		this.multiplier = 1;
		this.key = key.toUpperCase();
	}

	run(input) {
		super.run(input);

		if (this.process === processes.DECRYPT) {
			this.decrypt();
		} else {
			this.encrypt();
		}

		return this.output;
	}

	encrypt() {
		// Repeat the key so it is at least as long as the input. 
		let inputLength = this.input.length;
		let keyLength = this.key.length;

		if (keyLength === 0) {
			return this.output;
		}
		let extendedKey = this.key.repeat(Math.ceil(inputLength / keyLength));
		
		let output = '';
		for (let i = 0; i < this.input.length; i++) {
			let charCode = this.input.charCodeAt(i);
			let shift = getCharacterNumeric(extendedKey.charCodeAt(i));

			output += substitute(charCode, this.multiplier, shift);
		}

		this.output = output;
	}

	decrypt() {
		// Repeat the key so it is at least as long as the input. 
		let inputLength = this.input.length;
		let keyLength = this.key.length;

		if (keyLength === 0) {
			return this.output;
		}

		let extendedKey = this.key.repeat(Math.ceil(inputLength / keyLength));
		
		let output = '';
		for (let i = 0; i < this.input.length; i++) {
			let charCode = this.input.charCodeAt(i);
			let shift = getCharacterNumeric(extendedKey.charCodeAt(i));

			output += substitute(charCode, this.multiplier, -1 * shift);
		}

		this.output = output;
	}
	
	createSettings() {
		const $container = document.createElement('div');
		$container.classList.add('input-container');

		// Process
		const $processGroup = document.createElement('div');
		$processGroup.classList.add('input-group');
		$container.appendChild($processGroup);

		const $processLabel = document.createElement('label');
		$processLabel.htmlFor = 'process-select'
		$processLabel.innerHTML = 'Process'
		$processGroup.appendChild($processLabel);

		const $processSelect = document.createElement('select');
		$processSelect.id = 'process-select'
		$processSelect.addEventListener('change', () => {
			this.process = Number($processSelect.value);
			run();
		});
		$processGroup.appendChild($processSelect);
		
		const $encryptOption = document.createElement('option');
		$encryptOption.innerHTML = 'Encrypt';
		if (this.process === processes.ENCRYPT) {
			$encryptOption.selected = 'selected';
		}
		$encryptOption.value = processes.ENCRYPT;
		$processSelect.appendChild($encryptOption);
		
		const $decryptOption = document.createElement('option');
		$decryptOption.innerHTML = 'Decrypt';
		if (this.process === processes.DECRYPT) {
			$decryptOption.selected = 'selected';
		}
		$decryptOption.value = processes.DECRYPT;
		$processSelect.appendChild($decryptOption);

		// Key
		const $keyGroup = document.createElement('div');
		$keyGroup.classList.add('input-group');
		$container.appendChild($keyGroup);

		const $keyLabel = document.createElement('label');
		$keyLabel.htmlFor = 'key-input'
		$keyLabel.innerHTML = 'Key'
		$keyGroup.appendChild($keyLabel);

		const $keyInput = document.createElement('input');
		$keyInput.setAttribute('aria-describedBy', 'key-input-error');
		$keyInput.id = 'key-input'
		$keyInput.type = 'text';
		$keyInput.value = this.key;
		$keyInput.addEventListener('keyup', () => {
			this.key = $keyInput.value.toUpperCase();
			this.validateKey();
			run();
		});
		$keyGroup.appendChild($keyInput);

		const $keyError = document.createElement('p');
		$keyError.id = 'key-input-error';
		$keyGroup.appendChild($keyError);

		return $container;
	}

	validateKey() {
		// If the key is blank, warn the user
		const $keyError = document.querySelector('#key-input-error');
		if (this.key === '') {
			$keyError.innerHTML = `Warning: Key must not be blank.`;
		} else {
			$keyError.innerHTML = '';
		}
	}

	clone() {
		return new Vigenere();
	}
}

class Autokey extends Cipher {
	constructor(process = processes.ENCRYPT, primer = 'primer') {
		super();

		this.name = 'Autokey Cipher';
		this.process = process;
		this.primer = primer.toUpperCase();
		this.key = this.primer;
		this.multiplier = 1;
	}

	run(input) {
		super.run(input);

		if (this.process === processes.DECRYPT) {
			this.decrypt();
		} else {
			this.encrypt();
		}

		return this.output;
	}

	encrypt() {
		// Remove spaces, and put in upper case
		let updatedInput = this.input.replace(/\s/g,'').toUpperCase();
		this.key = this.primer + updatedInput;
		
		let output = '';
		for (let i = 0; i < updatedInput.length; i++) {
			let charCode = updatedInput.charCodeAt(i);
			let shift = getCharacterNumeric(this.key.charCodeAt(i));

			output += substitute(charCode, this.multiplier, shift);
		}

		this.output = output;
	}

	decrypt() {
		// Remove spaces, and put in upper case
		let updatedInput = this.input.replace(/\s/g,'').toUpperCase();
		this.key = this.primer;
		
		let output = '';
		for (let i = 0; i < updatedInput.length; i++) {
			let charCode = updatedInput.charCodeAt(i);
			let shift = getCharacterNumeric(this.key.charCodeAt(i));

			let newChar = substitute(charCode, this.multiplier, -1 * shift);
			output += newChar;
			this.key += newChar;
		}

		this.output = output;
	}
	
	createSettings() {
		const $container = document.createElement('div');
		$container.classList.add('input-container');

		// Process
		const $processGroup = document.createElement('div');
		$processGroup.classList.add('input-group');
		$container.appendChild($processGroup);

		const $processLabel = document.createElement('label');
		$processLabel.htmlFor = 'process-select'
		$processLabel.innerHTML = 'Process'
		$processGroup.appendChild($processLabel);

		const $processSelect = document.createElement('select');
		$processSelect.id = 'process-select'
		$processSelect.addEventListener('change', () => {
			this.process = Number($processSelect.value);
			run();
		});
		$processGroup.appendChild($processSelect);
		
		const $encryptOption = document.createElement('option');
		$encryptOption.innerHTML = 'Encrypt';
		if (this.process === processes.ENCRYPT) {
			$encryptOption.selected = 'selected';
		}
		$encryptOption.value = processes.ENCRYPT;
		$processSelect.appendChild($encryptOption);
		
		const $decryptOption = document.createElement('option');
		$decryptOption.innerHTML = 'Decrypt';
		if (this.process === processes.DECRYPT) {
			$decryptOption.selected = 'selected';
		}
		$decryptOption.value = processes.DECRYPT;
		$processSelect.appendChild($decryptOption);

		// Primer
		const $primerGroup = document.createElement('div');
		$primerGroup.classList.add('input-group');
		$container.appendChild($primerGroup);

		const $primerLabel = document.createElement('label');
		$primerLabel.htmlFor = 'primer-input'
		$primerLabel.innerHTML = 'Primer'
		$primerGroup.appendChild($primerLabel);

		const $primerInput = document.createElement('input');
		$primerInput.setAttribute('aria-describedBy', 'primer-input-error');
		$primerInput.id = 'primer-input'
		$primerInput.type = 'text';
		$primerInput.value = this.primer;
		$primerInput.addEventListener('keyup', () => {
			this.primer = $primerInput.value.toUpperCase();
			this.validatePrimer();
			run();
		});
		$primerGroup.appendChild($primerInput);

		const $primerError = document.createElement('p');
		$primerError.id = 'primer-input-error';
		$primerGroup.appendChild($primerError);

		return $container;
	}

	validatePrimer() {
		// If the primer is blank, warn the user
		const $primerError = document.querySelector('#primer-input-error');
		if (this.primer === '') {
			$primerError.innerHTML = `Warning: Primer must not be blank.`;
		} else {
			$primerError.innerHTML = '';
		}
	}

	clone() {
		return new Autokey();
	}
}

// Enums

const processes = {
	ENCRYPT: 1,
	DECRYPT: 2,
};
Object.freeze(processes);


const selectors = {
	close: 'button.button__close',
	functions: '.functions',
	input: "#input",
	output: "#output",
	functionContainer: '.function__container',
	functionCard: '[data-function-card]',
	setting: {
		container: '.setting__container',
		content: '.setting__content',
		title: '.setting__title',
	},
};
const functions = [
	// new RemoveWhitespace(),
	// new UpperCase(),
	// new Caesar(processes.ENCRYPT, 3),
	// new Caesar(processes.DECRYPT, 3),
	// new Atbash(processes.ENCRYPT),
	// new Atbash(processes.DECRYPT),
	// new Affine(processes.ENCRYPT, 5, 8),
	// new Affine(processes.DECRYPT, 5, 8),
	// new Keyword(processes.ENCRYPT, 'KEYWORD'),
	// new Keyword(processes.DECRYPT, 'KEYWORD'),
	// new Vigenere(processes.ENCRYPT, 'abcd'),
	// new Vigenere(processes.DECRYPT, 'abcd'),
	// new Autokey(processes.ENCRYPT, 'PRIMER'),
	// new Autokey(processes.DECRYPT, 'PRIMER'),
	// new Group(5),
];
const allFunctions = [
	new Group(),
	new RemoveWhitespace(),
	new LowerCase(),
	new UpperCase(),
	new CamelCase(),
	new KebabCase(),
	new SnakeCase(),
	new PascalCase(),
	new Caesar(),
	new Atbash(),
	new Affine(),
	new Keyword(),
	new Vigenere(),
	new Autokey(),
]

let $functions;
let $input;
let $output;
let $functionContainer;
let $functionCards;
let $settingContent;
let $settingTitle;
let deferredPrompt;

document.addEventListener('DOMContentLoaded', function(event){
	
	$functions = document.querySelector(selectors.functions);
	$input = document.querySelector(selectors.input);
	$output = document.querySelector(selectors.output);

	$functionContainer = document.querySelector(selectors.functionContainer);
	$functionCards = document.querySelectorAll(selectors.functionCard);
	$settingContent = document.querySelector(selectors.setting.content);
	$settingTitle = document.querySelector(selectors.setting.title);

	createFunctionCards();
	registerEventListeners();
	run();
});

function createFunctionCards() {
	let index = 0;
	allFunctions.forEach(f => {
		const $f = document.createElement('div');
		$f.id = `function-card-${index}`;
		$f.classList.add('card');
		$f.draggable = true;
		$f.dataset.functionCard = f.getName();
		$f.dataset.functionCardIndex = index;
		$f.addEventListener('dragstart', event => {
			event.dataTransfer.setData("text/plain", event.target.id);
		});
		$f.addEventListener('dragend', event => {
			run();
		});

		const $header = document.createElement('header');
		$header.classList.add('card__header');
		$f.appendChild($header);

		const $text = document.createElement('p');
		$text.innerHTML = f.getName();
		$header.appendChild($text);

		const $actionsContainer = document.createElement('div');
		$actionsContainer.classList.add('card__actions-container');
		$header.appendChild($actionsContainer);

		const $enableButton = document.createElement('button');
		$enableButton.classList.add('card__enable-button');
		$enableButton.classList.add('u-none');
		$enableButton.innerHTML = 'Disable';
		$actionsContainer.appendChild($enableButton);

		const $settingsButton = document.createElement('button');
		$settingsButton.classList.add('card__settings-button');
		$settingsButton.classList.add('u-none');
		$settingsButton.innerHTML = 'Settings';
		$actionsContainer.appendChild($settingsButton);

		const $removeButton = document.createElement('button');
		$removeButton.classList.add('card__remove-button');
		$removeButton.classList.add('u-none');
		$removeButton.innerHTML = 'Remove';
		$actionsContainer.appendChild($removeButton);

		const $settings = document.createElement('div');
		$settings.classList.add('card__settings-container');
		$settings.dataset.state = 'closed';
		$f.appendChild($settings);

		$functionContainer.appendChild($f);

		index++;
	});
}

function registerEventListeners() {
	$input.addEventListener('keyup', () => {
		run();
	});

	$dragArea = document.querySelector('#drag-area');
	$dragArea.addEventListener('dragover', event => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
	});
	$dragArea.addEventListener('drop', event => {
		event.preventDefault();
 		// Get the id of the target and add the moved element to the target's DOM
		const data = event.dataTransfer.getData("text/plain");
		const node = document.getElementById(data);
		const $newNode = node.cloneNode(true);
		$newNode.id = `function-${functions.length}`;
		$newNode.dataset.functionIndex = functions.length;
		$newNode.addEventListener('dragstart', event => {
			event.dataTransfer.setData("text/plain", event.target.id);
		});
		$newNode.addEventListener('dragend', event => {
			run();
		});

		const f = allFunctions[$newNode.dataset.functionCardIndex].clone();
		if (f) {
			// Show the enable/disable button
			const $enableButton = $newNode.querySelector('.card__enable-button');
			$enableButton.classList.remove('u-none');
			$enableButton.addEventListener('click', () => {
				// Get the function from the list
				/* for (let i = 0; i < functions.length; i++) {
					if (functions[i] === f) {
						func = f;
						break;
					}
				} */
				const enabled = f.enabled;
				if (enabled) {
					f.enabled = false;
					$enableButton.innerHTML = 'Enable';
				} else {
					f.enabled = true;
					$enableButton.innerHTML = 'Disable';
				}

				run();
			});

			// Show the remove button
			const $removeButton = $newNode.querySelector('.card__remove-button');
			$removeButton.classList.remove('u-none');
			$removeButton.addEventListener('click', () => {
				// Delete from functions
				for (let i = 0; i < functions.length; i++) {
					if (functions[i] === f) {
						functions.splice(i, 1);
					}
				}

				// Delete the node
				$newNode.remove();

				run();
			});
			
			// Check if the function has settings...
			if (typeof f.createSettings === 'function') {
				// If so, show the setting button.
				const $settingButton = $newNode.querySelector('.card__settings-button');
				$settingButton.classList.remove('u-none');
				$settingButton.addEventListener('click', () => {
					const $settingContainer = $newNode.querySelector('.card__settings-container');
					if ($settingContainer.dataset.state === 'open') {
						$settingContainer.dataset.state = 'closed';
						$settingContainer.setAttribute('aria-expanded', 'false');
						requestAnimationFrame(() => {
							$settingContainer.style.height = null;
						});
					} else {
						$settingContainer.dataset.state = 'open';
						$settingContainer.setAttribute('aria-expanded', 'true');
						requestAnimationFrame(() => {
							$settingContainer.style.height = `${$settingContainer.children[0].offsetHeight}px`;
						});
					}
				});

				// Create the settings
				const $settingContainer = $newNode.querySelector('.card__settings-container');
				$settingContainer.innerHTML = '';
				$settingContainer.appendChild(f.createSettings());
			}

			functions.push(f);
		}

		event.target.appendChild($newNode);
	});
}

function run() {
	let input = $input.value;

	functions.forEach(f => {
		if (f.enabled) {
			input = f.run(input);
		}
	});

	$output.value = input;
}

function modulo(n, m) {
	return ((n % m) + m) % m;
}

function getCharacterNumeric(charCode) {
	if (charCode >= 65 && charCode <= 90) {
		return modulo(charCode - 65, 26);
	} else if (charCode >= 97 && charCode <= 122) {
		return modulo(charCode - 97, 26);
	}
}

function substitute(charCode, multiplier, shift) {
	// UTF-16 characters codes
	// A = 65
	// Z = 90
	// a = 97
	// z = 122
	const characterCount = 26;

	if (charCode >= 65 && charCode <= 90) {
		return String.fromCharCode(modulo(((multiplier * charCode + shift) - 65), characterCount) + 65);
	} else if (charCode >= 97 && charCode <= 122) {
		return String.fromCharCode(modulo(((multiplier * charCode + shift) - 97), characterCount) + 97);
	}
}

// https://developers.google.com/web/ilt/pwa/lab-offline-quickstart#52_activating_the_install_prompt
window.addEventListener('beforeinstallprompt', (event) => {

	// Prevent Chrome 67 and earlier from automatically showing the prompt
	event.preventDefault();

	// Stash the event so it can be triggered later.
	deferredPrompt = event;

	// Attach the install prompt to a user gesture
	document.getElementById('install').addEventListener('click', (event) => {

		// Show the prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			}
			else {
				console.log('User dismissed the A2HS prompt');
			}
			deferredPrompt = null;
		});
	});

	document.getElementById('install').setAttribute('aria-hidden', false);
});

// When the app is installed it should remove the install snackbar
window.addEventListener('appinstalled', (event) => {
	console.log('a2hs installed');
	document.getElementById('install').setAttribute('aria-hidden', true);
});