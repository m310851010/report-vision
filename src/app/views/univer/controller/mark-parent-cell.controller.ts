import { IRange, IWorkbookData, Nullable, UnitModel, UniverInstanceType } from '@univerjs/core';
import { Disposable, ICommandService } from '@univerjs/core';
import { Inject } from '@wendellhu/redi';

import type { IRenderContext, IRenderController } from '@univerjs/engine-render';
import { IMarkParentCellService } from '../service/mark-parent-cell.service';
import { MarkParentCellOperation } from '../command/parent-cell.command';
import { ClearSelectionContentCommand, SelectionManagerService } from '@univerjs/sheets';
import { SheetSkeletonManagerService } from '@univerjs/sheets-ui';

export class MarkParentCellController<T extends UnitModel<IWorkbookData, UniverInstanceType.UNIVER_SHEET>>
  extends Disposable
  implements IRenderController
{
  constructor(
    private readonly _context: IRenderContext<T>,
    @Inject(IMarkParentCellService) private _markSelectionService: IMarkParentCellService,
    @ICommandService private _commandService: ICommandService,
    @Inject(SelectionManagerService) private _selectionManager: SelectionManagerService,
    @Inject(SheetSkeletonManagerService) private readonly _sheetSkeletonManagerService: SheetSkeletonManagerService
  ) {
    super();
    this._addRefreshListener();
  }

  private _addRefreshListener() {
    this.disposeWithMe(
      this._selectionManager.selectionMoveStart$.subscribe(selection => {
        let range: Nullable<IRange>;
        if (selection && selection.length) {
          range = selection[0].range;
        }
        this._commandService.executeCommand(MarkParentCellOperation.id, { range });
      })
    );
    this.disposeWithMe(
      this._commandService.onCommandExecuted(command => {
        if (command.id === ClearSelectionContentCommand.id) {
          this._commandService.executeCommand(MarkParentCellOperation.id, {});
        }
      })
    );
    this.disposeWithMe(
      this._sheetSkeletonManagerService.currentSkeleton$.subscribe(skeleton => {
        if (skeleton) {
          this._markSelectionService.refreshShapes();
        }
      })
    );
  }
}
