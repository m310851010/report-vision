import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import {
  BooleanNumber,
  HorizontalAlign,
  IWorkbookData,
  LocaleType,
  LogLevel,
  Univer,
  UniverInstanceType,
  VerticalAlign
} from '@univerjs/core';
import { greenTheme, defaultTheme } from '@univerjs/design';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverUIPlugin } from '@univerjs/ui';
import { locales } from './plugin/locales';
import { FUNCTION_LIST_USER, functionUser } from './plugin/report-function';
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui';
import { UniverSheetsFindReplacePlugin } from '@univerjs/sheets-find-replace';
import { UniverDataValidationPlugin } from '@univerjs/data-validation';
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';

import { DragDropPlugin } from './plugin/drag-drop.plugin';
import { createObjectMatrix, UniverApi } from './univer-api';
import { CellDisableEditPlugin } from './plugin/cell-disable-edit.plugin';
import { ToolbarConditionsPlugin } from './plugin/toolbar-conditions.plugin';
import { NotExecuteFormulaPlugin } from './plugin/not-execute-formula.plugin';
import { SymbolPlugin } from './plugin/symbol.plugin';
import { FUniver } from '@univerjs/facade';
import { ParentCellPlugin } from './plugin/parent-cell.plugin';

@Directive({
  selector: '[r-univer]',
  exportAs: 'Runiver'
})
export class UniverDirective implements OnInit, OnDestroy {
  univer!: Univer;
  @Input() workbookData!: IWorkbookData;
  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
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
        footer: false
      });

      univer.registerPlugin(UniverDocsPlugin, {
        hasScroll: false
      });
      univer.registerPlugin(UniverDocsUIPlugin);

      univer.registerPlugin(UniverSheetsPlugin, { notExecuteFormula: true });
      univer.registerPlugin(UniverSheetsUIPlugin);

      // sheet feature plugins
      univer.registerPlugin(UniverSheetsNumfmtPlugin);
      univer.registerPlugin(UniverFormulaEnginePlugin, {
        notExecuteFormula: true,
        function: functionUser
      });
      univer.registerPlugin(UniverSheetsFormulaPlugin, {
        description: FUNCTION_LIST_USER
      });
      // univer.registerPlugin(UniverRPCMainThreadPlugin, {
      //   workerURL: FormulaWork
      // });

      // univer.registerPlugin(UniverFindReplacePlugin);
      univer.registerPlugin(UniverSheetsFindReplacePlugin);
      univer.registerPlugin(UniverDataValidationPlugin);
      univer.registerPlugin(UniverSheetsDataValidationPlugin);
      univer.registerPlugin(UniverSheetsZenEditorPlugin);

      // univer.registerPlugin(SheetsConditionalFormattingPlugin);
      univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin);

      univer.registerPlugin(SymbolPlugin);
      univer.registerPlugin(DragDropPlugin);
      univer.registerPlugin(CellDisableEditPlugin);
      univer.registerPlugin(NotExecuteFormulaPlugin);
      univer.registerPlugin(ToolbarConditionsPlugin);
      univer.registerPlugin(ParentCellPlugin);

      const rowCount = 20;
      const columnCount = 26;
      // create univer sheet instance
      const unitModel = univer.createUnit(UniverInstanceType.UNIVER_SHEET, {
        id: UniverApi.unitId,
        sheets: {
          sheet: {
            id: UniverApi.sheetId,
            name: UniverApi.sheetId,
            rowCount,
            columnCount,
            defaultColumnWidth: 120,
            defaultRowHeight: 29,
            showGridlines: 1,
            cellData: createObjectMatrix(rowCount, columnCount, {
              s: { vt: VerticalAlign.MIDDLE }
            }),
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

      // univer.createUnit(UniverInstanceType.UNIVER_SHEET, DATA);

      UniverApi.newApi(univer);

      const univerAPI = FUniver.newAPI(univer);
      // UniverService.univerApi = univerAPI;
      // univerAPI.onBeforeCommandExecute();
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
    });
  }

  ngOnDestroy(): void {
    this.univer.dispose();
  }
}
