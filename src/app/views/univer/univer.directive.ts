import { ChangeDetectionStrategy, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Univer,
  Workbook,
  UniverInstanceType,
  IWorkbookData,
  LocaleType,
  LogLevel,
  BooleanNumber
} from '@univerjs/core';
import { greenTheme } from '@univerjs/design';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { IRenderingEngine, IRenderManagerService, UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { HoverManagerService, UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverUIPlugin } from '@univerjs/ui';
import { locales } from './plugin/locales';
import { FUNCTION_LIST_USER, functionUser } from './plugin/report-function';
import { FUniver } from '@univerjs/facade';
import { SheetsConditionalFormattingPlugin } from '@univerjs/sheets-conditional-formatting';
import { UniverFindReplacePlugin } from '@univerjs/find-replace';
import { UniverSheetsFindReplacePlugin } from '@univerjs/sheets-find-replace';
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui';

import { MainCustomExtension } from './plugin/cell-extension';
import { DragDropPlugin } from './plugin/drag-drop-plugin';

@Directive({
  selector: '[r-univer]',
  exportAs: 'Runiver'
})
export class UniverDirective implements OnInit, OnDestroy {
  univer!: Univer;
  @Input() workbookData!: IWorkbookData;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const univer = new Univer({
      locale: LocaleType.ZH_CN,
      theme: greenTheme,
      locales,
      logLevel: LogLevel.VERBOSE
    });

    this.univer = univer;

    univer.registerPlugin(UniverRenderEnginePlugin);

    univer.registerPlugin(UniverUIPlugin, {
      container: this.elementRef.nativeElement,
      header: true,
      footer: true
    });

    univer.registerPlugin(UniverDocsPlugin, {
      hasScroll: false
    });
    univer.registerPlugin(UniverDocsUIPlugin);

    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);

    // sheet feature plugins
    univer.registerPlugin(UniverSheetsNumfmtPlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin, {
      function: functionUser
    });
    univer.registerPlugin(UniverSheetsFormulaPlugin, {
      description: FUNCTION_LIST_USER
    });

    univer.registerPlugin(SheetsConditionalFormattingPlugin);

    // univer.registerPlugin(UniverFindReplacePlugin);
    univer.registerPlugin(UniverSheetsFindReplacePlugin);
    univer.registerPlugin(DragDropPlugin);

    let unitId = 'workbook';
    // create univer sheet instance
    const model = univer.createUnit(UniverInstanceType.UNIVER_SHEET, {
      id: unitId,
      sheets: {
        'sheet-root': {
          id: 'sheet-root',
          name: 'sheet-root',
          rowCount: 20,
          columnCount: 26,
          defaultColumnWidth: 120,
          defaultRowHeight: 25,
          showGridlines: 1,
          rowHeader: {
            width: 30,
            hidden: BooleanNumber.FALSE
          },
          columnHeader: {
            height: 25,
            hidden: BooleanNumber.FALSE
          },
          rightToLeft: BooleanNumber.FALSE
        }
      }
    });

    // const univerAPI = FUniver.newAPI(univer);
    // console.log(univerAPI);
    // univerAPI.onCommandExecuted((c, o) => {
    //   console.log(c);
    // });
    //
    // univerAPI.onBeforeCommandExecute((c, o) => {
    //   console.log(c);
    // });

    // univerAPI.registerSheetMainExtension(unitId, new MainCustomExtension());
    // const engine = univer.__getInjector().get(IRenderManagerService);
    // const scene = engine.getCurrent()!.scene;
    // console.log(scene);
  }

  ngOnDestroy(): void {
    this.univer.dispose();
  }
}
