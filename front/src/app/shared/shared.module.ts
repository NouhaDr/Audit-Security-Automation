import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { CheckboxModule } from "primeng/checkbox";
import { ChipModule } from "primeng/chip";
import { ChipsModule } from "primeng/chips";
import { ColorPickerModule } from "primeng/colorpicker";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { KnobModule } from "primeng/knob";
import { ListboxModule } from "primeng/listbox";
import { MultiSelectModule } from "primeng/multiselect";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PasswordModule } from "primeng/password";
import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from "primeng/rating";
import { SelectButtonModule } from "primeng/selectbutton";
import { SliderModule } from "primeng/slider";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { DialogModule } from "primeng/dialog";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { FieldsetModule } from "primeng/fieldset";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from "primeng/tooltip";
import { SplitButtonModule } from "primeng/splitbutton";
import { ShortenPipe } from "./pipes/shorten.pipe";
import { TreeModule } from "primeng/tree";
import { AccordionModule } from "primeng/accordion";
import { DividerModule } from "primeng/divider";
import { BadgeModule } from "primeng/badge";
import { FileUploadModule } from "primeng/fileupload";
import { TabViewModule } from "primeng/tabview";



@NgModule({
    declarations : [],
    imports : [
		ShortenPipe
	],
    exports : [
		CommonModule,
		FormsModule,
		AutoCompleteModule,
		CalendarModule,
		ChipsModule,
		DropdownModule,
		InputMaskModule,
		InputNumberModule,
		ColorPickerModule,
		CascadeSelectModule,
		MultiSelectModule,
		ToggleButtonModule,
		SliderModule,
		InputTextareaModule,
		RadioButtonModule,
		InputTextModule,
		RatingModule,
		ChipModule,
		KnobModule,
		InputSwitchModule,
		ListboxModule,
		SelectButtonModule,
		CheckboxModule,
		ButtonModule,
		InputGroupModule,
		InputGroupAddonModule,
		TableModule,
		ToastModule,
		PasswordModule,
		ConfirmDialogModule,
		CommonModule,
		ToastModule,
		FormsModule,
		InputTextModule,
		ButtonModule,
		TableModule,
		ConfirmDialogModule,
		OverlayPanelModule,
		DialogModule,
		AvatarModule,
		AvatarGroupModule,
		ReactiveFormsModule,
		FieldsetModule,
		ProgressSpinnerModule,
		TooltipModule,
		SplitButtonModule,
		ChipsModule,
		ChipModule,
		ShortenPipe,
		TreeModule,
		AccordionModule,
		DividerModule,
		BadgeModule,
		KnobModule,
		FileUploadModule,
		TabViewModule,
		ToastModule,
	],
    providers : [],
})
export class SharedModule {

}