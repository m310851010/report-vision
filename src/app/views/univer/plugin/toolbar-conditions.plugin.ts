import {
  CommandType,
  ICommand,
  ICommandService,
  IUniverInstanceService,
  LocaleService,
  Plugin,
  UniverInstanceType,
  Workbook
} from '@univerjs/core';
import { Injector } from '@wendellhu/redi';
import { ComponentManager, IMenuService, MenuGroup, MenuItemType, MenuPosition } from '@univerjs/ui';
import { Conditions } from '@univerjs/icons';

/**
 * 禁止编辑
 */
export class ToolbarConditionsPlugin extends Plugin {
  static override pluginName = 'report.conditions-plugin';
  static override type = UniverInstanceType.UNIVER_SHEET;
  _injector!: Injector;

  override onStarting(injector: Injector) {
    this._injector = injector;
    const componentManager = injector.get(ComponentManager);
    const menuService = injector.get(IMenuService);
    componentManager.register('ReportConditions', Conditions);

    const conditionId = 'report.conditions';
    let index = 0;

    const menuItem = {
      id: conditionId,
      tooltip: '条件格式化',
      icon: 'ReportConditions', // icon name
      type: MenuItemType.SUBITEMS,
      group: MenuGroup.TOOLBAR_LAYOUT,
      positions: [MenuPosition.TOOLBAR_START]
    };

    menuService.addMenuItem(menuItem, {});

    menuService.addMenuItem(
      {
        id: conditionId + '_' + CF_MENU_OPERATION.highlightCell,
        title: '突出显示单元格',
        icon: 'EMPTY_ICON_TYPE',
        type: MenuItemType.BUTTON,
        positions: [conditionId, MenuPosition.CONTEXT_MENU]
      },
      {}
    );

    menuService.addMenuItem(
      {
        id: conditionId + '_' + CF_MENU_OPERATION.icon,
        title: '图表',
        type: MenuItemType.BUTTON,
        positions: [conditionId]
      },
      {}
    );

    const command: ICommand = {
      type: CommandType.OPERATION,
      id: conditionId + '_' + CF_MENU_OPERATION.highlightCell,
      handler: accessor => {
        // inject univer instance service
        const univer = accessor.get(IUniverInstanceService);
        const localeService = accessor.get(LocaleService);
        // const commandService = accessor.get(ICommandService);

        // get current sheet
        const sheet = univer.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!.getActiveSheet();

        // // wait user select csv file
        // waitUserSelectCSVFile(({ data, rowsCount, colsCount }) => {
        //   // set sheet size
        //   sheet.setColumnCount(colsCount);
        //   sheet.setRowCount(rowsCount);
        //
        //   // set sheet data

        commandService.executeCommand('sheet.operation.open.conditional.formatting.panel', {
          value: CF_MENU_OPERATION.highlightCell
        });
        // });
        return true;
      }
    };

    const commandService = injector.get(ICommandService);
    commandService.registerCommand(command);
  }
}

export enum CF_MENU_OPERATION {
  createRule = 1,
  viewRule,
  highlightCell,
  rank,
  formula,
  colorScale,
  dataBar,
  icon,
  clearRangeRules,
  clearWorkSheetRules
}
