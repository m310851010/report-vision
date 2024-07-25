import { Plugin, UniverInstanceType } from '@univerjs/core';
import { Injector } from '@wendellhu/redi';
import { univerApi } from '../univer-api';
import { Spreadsheet } from '@univerjs/engine-render';
import { IconUKey } from '@univerjs/sheets-conditional-formatting';
import { ConditionalFormattingIcon } from '@univerjs/sheets-conditional-formatting';
import { SymbolRender } from './symbol.render';

/**
 * 禁止绑定数据集的单元格编辑
 */
export class SymbolPlugin extends Plugin {
  static override pluginName = 'report.symbol.plugin';
  static override type = UniverInstanceType.UNIVER_SHEET;
  _injector!: Injector;

  override onStarting(injector: Injector) {
    this._injector = injector;
  }

  override onRendered() {
    const render = univerApi.renderManagerService.getRenderById(univerApi.getWorkbook().getUnitId())!;
    const spreadsheetRender = render && (render.mainComponent as Spreadsheet);
    const iconRender = spreadsheetRender.getExtensionByKey(IconUKey)! as ConditionalFormattingIcon;
    spreadsheetRender.register(new SymbolRender(iconRender));
  }
}
