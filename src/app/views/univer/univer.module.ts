import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniverDirective } from './univer.directive';

@NgModule({
  declarations: [UniverDirective],
  imports: [CommonModule],
  exports: [UniverDirective]
})
export class UniverModule {}
