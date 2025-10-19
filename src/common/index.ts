export function isDefined(value: any): boolean {
  return (value !== undefined);
}

export function isDefinedAndNotNull(value: any): boolean {
  return (value !== undefined) && (value !== null);
}

export function isUndefined(value: any): boolean {
  return (value === undefined);
}

export function isUndefinedOrNull(value: any): boolean {
  return (value === undefined) || (value === null);
}

export function stringify(
  obj: any,
  indent: number = 4,
  linePrefix: string = '',
  quoteFieldNames: boolean = true,
): string {
  const lines = JSON.stringify(obj, null, indent).split('\n');

  if (linePrefix !== '') {
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < lines.length; i++) {
      lines[i] = linePrefix + lines[i];
    }
  }

  if (!quoteFieldNames) {
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < lines.length - 1; i++) {
      if ((lines[i].match(/:/g) || []).length > 0) {
        const valuePair = lines[i].split(':');
        valuePair[0] = valuePair[0].replace(/"/g, '');
        lines[i] = valuePair.join(':');
      }
    }
  }

  return lines.join('\n');
}
