import type { ArrayValueObject, BaseValueObject, IFunctionInfo } from '@univerjs/engine-formula';
import { BaseFunction, FunctionType, NumberValueObject, IFunctionNames } from '@univerjs/engine-formula';
import { Ctor } from '@wendellhu/redi';

/**
 * function name
 */
export enum FUNCTION_NAMES_USER {
  CUSTOMSUM = 'CUSTOMSUM'
}

export const functionZhCN = {
  formula: {
    functionList: {
      CUSTOMSUM: {
        description: '将单个值、单元格引用或是区域相加，或者将三者的组合相加。',
        abstract: '求参数的和',
        links: [
          {
            title: '教学',
            url: 'https://support.microsoft.com/zh-cn/office/sum-%E5%87%BD%E6%95%B0-043e1c7d-7726-4e80-8f32-07b23e057f89'
          }
        ],
        functionParameter: {
          number1: {
            name: '数值1',
            detail: '要相加的第一个数字。 该数字可以是 4 之类的数字，B6 之类的单元格引用或 B2:B8 之类的单元格范围。'
          },
          number2: {
            name: '数值2',
            detail: '这是要相加的第二个数字。 可以按照这种方式最多指定 255 个数字。'
          }
        }
      }
    }
  }
};

/**
 * description
 */
export const FUNCTION_LIST_USER: IFunctionInfo[] = [
  {
    functionName: FUNCTION_NAMES_USER.CUSTOMSUM,
    aliasFunctionName: 'formula.functionList.CUSTOMSUM.aliasFunctionName',
    functionType: FunctionType.Univer,
    description: 'formula.functionList.CUSTOMSUM.description',
    abstract: 'formula.functionList.CUSTOMSUM.abstract',
    functionParameter: [
      {
        name: 'formula.functionList.CUSTOMSUM.functionParameter.number1.name',
        detail: 'formula.functionList.CUSTOMSUM.functionParameter.number1.detail',
        example: 'A1:A20',
        require: 1,
        repeat: 0
      },
      {
        name: 'formula.functionList.CUSTOMSUM.functionParameter.number2.name',
        detail: 'formula.functionList.CUSTOMSUM.functionParameter.number2.detail',
        example: 'B2:B10',
        require: 0,
        repeat: 1
      }
    ]
  }
];

/**
 * Function algorithm
 */
export class Customsum extends BaseFunction {
  override calculate(...variants: BaseValueObject[]) {
    let accumulatorAll: BaseValueObject = new NumberValueObject(0);
    for (let i = 0; i < variants.length; i++) {
      let variant = variants[i];

      if (variant.isError()) {
        return variant;
      }

      if (accumulatorAll.isError()) {
        return accumulatorAll;
      }

      if (variant.isArray()) {
        variant = (variant as ArrayValueObject).sum();
      }

      accumulatorAll = accumulatorAll.plus(variant as BaseValueObject);
    }

    return accumulatorAll;
  }
}

export const functionUser: Array<[Ctor<BaseFunction>, IFunctionNames]> = [[Customsum, FUNCTION_NAMES_USER.CUSTOMSUM]];
