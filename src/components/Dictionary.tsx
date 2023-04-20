/*
 * Author: Hüseyin Ilıcan
 * Date: 13/06/2022
 * Purpose: Dictionary and its utils.
 */
export const dictionary: { [key: string]: string[] } = {};

// Creates a dictionary with each letter as key and array of strings whose words start with that letter.
export const fillDictionary = (
  dictionary: { [key: string]: string[] },
  names: string[]
) => {
  names.forEach((name: string) => {
    const firstChar = name.charAt(0);
    if (dictionary[firstChar]) {
      dictionary[firstChar].push(name);
    } else {
      dictionary[firstChar] = [name];
    }
  });
};

// Logic for CPU's word guessing.
export const returnRandomWord = (
  char: string,
  spokenWords: string[]
): string => {
  const word =
    dictionary[char][Math.floor(Math.random() * dictionary[char].length)];
  if (spokenWords.includes(word)) {
    return returnRandomWord(char, spokenWords);
  }
  return word;
};

// Random word for start with math.Random()
export const returnRandomNameForStart = (dictionary: {
  [key: string]: string[];
}) => {
  let randomChar = "";
  const characters = "abcdefghijklmnoprstuvwyzüşçöıâ";
  const charactersLength = characters.length;
  randomChar = characters.charAt(Math.floor(Math.random() * charactersLength));
  return dictionary[randomChar][
    Math.floor(Math.random() * dictionary[randomChar].length)
  ];
};
