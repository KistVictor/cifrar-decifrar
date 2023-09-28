//Cesar
function cesarEncrypt(plaintext, key) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  key = parseInt(key, 10);
  let output = '';
  plaintext = plaintext.toUpperCase();
  
  for (let i = 0; i < plaintext.length; i++) {
    let letter = plaintext[i];
    if (alphabet.includes(letter)) {
      let index = (alphabet.indexOf(letter) + key) % 26;
      output += alphabet[index];
    } else {
      output += letter;
    }
  }
  return output;
}

function cesarDecrypt(ciphertext, key) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  key = parseInt(key, 10);
  let output = '';
  ciphertext = ciphertext.toUpperCase();
  
  for (let i = 0; i < ciphertext.length; i++) {
    let letter = ciphertext[i];
    if (alphabet.includes(letter)) {
      let index = (alphabet.indexOf(letter) - key + 26) % 26;
      output += alphabet[index];
    } else {
      output += letter;
    }
  }
  return output;
}

//Vernam
function vernamEncrypt(plaintext, key) {
  let output = '';
  for (let i = 0; i < plaintext.length; i++) {
      let charCode = plaintext.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
  }
  return output;
}

function vernamDecrypt(ciphertext, key) {
  // A decifragem é exatamente a mesma que a cifragem, graças à natureza reversível do XOR.
  return vernamEncrypt(ciphertext, key);
}

//Vinegere
function vigenereEncrypt(plaintext, key) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let output = '';
  plaintext = plaintext.toUpperCase();
  key = key.toUpperCase();

  for (let i = 0, j = 0; i < plaintext.length; i++) {
      let letter = plaintext[i];
      if (alphabet.includes(letter)) {
          let shift = alphabet.indexOf(key[j % key.length]);
          let index = (alphabet.indexOf(letter) + shift) % 26;
          output += alphabet[index];
          j++;
      } else {
          output += letter;
      }
  }
  return output;
}

function vigenereDecrypt(ciphertext, key) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let output = '';
  ciphertext = ciphertext.toUpperCase();
  key = key.toUpperCase();

  for (let i = 0, j = 0; i < ciphertext.length; i++) {
      let letter = ciphertext[i];
      if (alphabet.includes(letter)) {
          let shift = alphabet.indexOf(key[j % key.length]);
          let index = (alphabet.indexOf(letter) - shift + 26) % 26;
          output += alphabet[index];
          j++;
      } else {
          output += letter;
      }
  }
  return output;
}

//Playfair
function generatePlayfairMatrix(key) {
  key = key.toUpperCase().replace(/J/g, 'I');
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
  const matrix = [];
  let currentLetter = 0;

  for (let letter of key + alphabet) {
      if (!matrix.flat().includes(letter)) {
          if (currentLetter % 5 === 0) matrix.push([]);
          matrix[Math.floor(currentLetter / 5)].push(letter);
          currentLetter++;
      }
  }
  return matrix;
}

function findPosition(matrix, letter) {
  for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] === letter) return [i, j];
      }
  }
}

function playfairEncrypt(plaintext, key) {
  const matrix = generatePlayfairMatrix(key);
  let output = '';
  plaintext = plaintext.toUpperCase().replace(/J/g, 'I');

  for (let i = 0; i < plaintext.length; i += 2) {
      if (plaintext[i] === plaintext[i + 1]) plaintext = plaintext.slice(0, i + 1) + 'X' + plaintext.slice(i + 1);
      let [row1, col1] = findPosition(matrix, plaintext[i]);
      let [row2, col2] = findPosition(matrix, plaintext[i + 1] || 'X');
      if (row1 === row2) {
          output += matrix[row1][(col1 + 1) % 5] + matrix[row2][(col2 + 1) % 5];
      } else if (col1 === col2) {
          output += matrix[(row1 + 1) % 5][col1] + matrix[(row2 + 1) % 5][col2];
      } else {
          output += matrix[row1][col2] + matrix[row2][col1];
      }
  }
  return output;
}

function playfairDecrypt(ciphertext, key) {
  const matrix = generatePlayfairMatrix(key);
  let output = '';
  ciphertext = ciphertext.toUpperCase().replace(/J/g, 'I');

  for (let i = 0; i < ciphertext.length; i += 2) {
      let [row1, col1] = findPosition(matrix, ciphertext[i]);
      let [row2, col2] = findPosition(matrix, ciphertext[i + 1] || 'X');
      if (row1 === row2) {
          output += matrix[row1][(col1 - 1 + 5) % 5] + matrix[row2][(col2 - 1 + 5) % 5];
      } else if (col1 === col2) {
          output += matrix[(row1 - 1 + 5) % 5][col1] + matrix[(row2 - 1 + 5) % 5][col2];
      } else {
          output += matrix[row1][col2] + matrix[row2][col1];
      }
  }
  return output;
}

//Hill
function modInverse(a, m) {
  a = a % m;
  for (let x = 1; x < m; x++) {
      if ((a * x) % m == 1) {
          return x;
      }
  }
  return 1;
}

function hillEncrypt(plaintext, keyMatrix) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  plaintext = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
  let output = '';
  for (let i = 0; i < plaintext.length; i += 2) {
      let vector = [alphabet.indexOf(plaintext[i]), alphabet.indexOf(plaintext[i + 1] || 'X')];
      let encryptedVector = [
          (keyMatrix[0][0] * vector[0] + keyMatrix[0][1] * vector[1]) % 26,
          (keyMatrix[1][0] * vector[0] + keyMatrix[1][1] * vector[1]) % 26,
      ];
      output += alphabet[encryptedVector[0]] + alphabet[encryptedVector[1]];
  }
  return output;
}

function hillDecrypt(ciphertext, keyMatrix) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let det = keyMatrix[0][0] * keyMatrix[1][1] - keyMatrix[0][1] * keyMatrix[1][0];
  det = modInverse(det, 26);
  let adjMatrix = [
      [keyMatrix[1][1] * det, (-keyMatrix[0][1] * det + 26) % 26],
      [(-keyMatrix[1][0] * det + 26) % 26, keyMatrix[0][0] * det],
  ];
  let output = '';
  for (let i = 0; i < ciphertext.length; i += 2) {
      let vector = [alphabet.indexOf(ciphertext[i]), alphabet.indexOf(ciphertext[i + 1])];
      let decryptedVector = [
          (adjMatrix[0][0] * vector[0] + adjMatrix[0][1] * vector[1]) % 26,
          (adjMatrix[1][0] * vector[0] + adjMatrix[1][1] * vector[1]) % 26,
      ];
      output += alphabet[decryptedVector[0]] + alphabet[decryptedVector[1]];
  }
  return output;
}

$(function() {
  $('#encrypt').click(function() {
    var cipher = $('#cipher').val();
    var plaintext = $('#plaintext').val();
    var key = $('#key').val();
    console.log("encrypt", key);
    var output = '';
    switch (cipher) {
      case 'cesar':
        console.log("cesar");
        output = cesarEncrypt(plaintext, key);
        break;
      case 'vernam':
        console.log("vernam");
        output = vernamEncrypt(plaintext, key);
        break;
      case 'vigenere':
        console.log("vigenere");
        output = vigenereEncrypt(plaintext, key);
        break;
      case 'playfair':
        output = playfairEncrypt(plaintext, key);
        break;
      case 'hill':
        var keyMatrix = [
          [parseInt(key[0]), parseInt(key[1])],
          [parseInt(key[2]), parseInt(key[3])],
        ];
        output = hillEncrypt(plaintext, keyMatrix);
        break;
      case 'rsa':
        console.log($('#pubkey').val())
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey($('#pubkey').val());
        output = encrypt.encrypt(plaintext);
        break;
    }
    $('#output').val(output);
  });

  $('#decrypt').click(function() {
    var cipher = $('#cipher').val();
    var ciphertext = $('#output').val();
    var key = $('#key').val();
    console.log("decrypt", key);
    var output = '';
    switch (cipher) {
      case 'cesar':
        output = cesarDecrypt(ciphertext, key);
        break;
      case 'vernam':
        output = vernamDecrypt(ciphertext, key);
        break;
      case 'vigenere':
        output = vigenereDecrypt(ciphertext, key);
        break;
      case 'playfair':
        output = playfairDecrypt(ciphertext, key);
        break;
      case 'hill':
        var keyMatrix = [
          [parseInt(key[0]), parseInt(key[1])],
          [parseInt(key[2]), parseInt(key[3])],
        ];
        output = hillDecrypt(ciphertext, keyMatrix);
        break;
      case 'rsa':
        var decrypt = new JSEncrypt();
        decrypt.setPrivateKey($('#privkey').val());
        output = decrypt.decrypt(ciphertext);
        break;
    }
    $('#plaintext').val(output);
  });
});