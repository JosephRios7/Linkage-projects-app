import { TemplateRef, ViewContainerRef } from '@angular/core';
import { HasRoleDirective } from './has-role.directive';

describe('HasRoleDirective', () => {
  it('should create an instance', () => {
    const templateRef = {} as TemplateRef<any>;
    const viewContainer = {} as ViewContainerRef;
    const directive = new HasRoleDirective(templateRef, viewContainer);
    expect(directive).toBeTruthy();
  });
});
