import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Univer, Workbook, UniverInstanceType, IWorkbookData, LocaleType, LogLevel } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
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

@Directive({
  selector: '[r-univer]'
})
export class UniverDirective implements OnInit, OnDestroy {
  univer!: Univer;
  @Input() workbookData!: IWorkbookData;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const univer = new Univer({
      locale: LocaleType.ZH_CN,
      theme: defaultTheme,
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

    // create univer sheet instance
    univer.createUnit(UniverInstanceType.UNIVER_SHEET, {});
  }

  ngOnDestroy(): void {
    this.univer.dispose();
  }
}
