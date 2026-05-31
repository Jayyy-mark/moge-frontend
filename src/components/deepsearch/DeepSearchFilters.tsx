import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { X } from "lucide-react";
import Select from "react-select";
import DatePicker from "../form/date-picker";
import Label from "../form/Label";
import { useSelectOptions } from "../../hooks/useSelectOptions";
import { helper } from "../../helpers/utils";
import { DeepSearchDocument } from "../../interfaces/document";

const DeepSearchFilter = forwardRef(({ onSearch }: any, ref) => {

    const [form, setForm] = useState<DeepSearchDocument>({
        text: "",
        department_id: "",
        category_id:"",
        document_status:"",

        from_date:null,
        to_date:null,

        updated_from_date:null,
        updated_to_date:null,
    });


    const documentStatusOptions = [
        { value: "archived", label:"Archived" , data:{}},
        { value: "recycled", label:"Recycled" , data:{}}
    ]

    const { options: departmentOptions } = useSelectOptions(
        helper.fetchDepartments,
        "department_name"
    );

    const { options: categoryOptions } = useSelectOptions(
        helper.fetchCategories,
        "category_name"
    );

    const rangeRef = useRef<any>(null);

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        onSearch(form);
    };

    useImperativeHandle(ref, () => ({
        submit: handleSubmit,
        reset: () => {
            setForm({
                text: "",
                department_id: "",
                category_id:"",
                document_status:"",

                from_date:null,
                to_date:null,

                updated_from_date:null,
                updated_to_date:null,
            });

            rangeRef.current?.clear();
        }
    }));

    return (
        <div className="w-full">

            {/* SEARCH AREA */}
            <div className="relative mb-6">
                <Label>Enter texts that you want to search :</Label>

                {form.text && (
                    <button
                        onClick={() => handleChange("text", "")}
                        className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}

                <textarea
                    value={form.text}
                    onChange={(e) => handleChange("text", e.target.value)}
                    rows={4}
                    placeholder="Type anything... e.g. AI IoT business plan, student attendance report, financial document..."
                    className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* FILTER GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Department */}
                <div>
                    <Label>Department</Label>
                    <Select
                        options={departmentOptions}
                        value={departmentOptions.find(o => o.value === form.department_id) || null}
                        onChange={(opt) => handleChange("department_id", opt?.value || "")}
                        isClearable
                        className="mt-2"
                    />
                </div>

                {/* Category */}
                <div>
                    <Label>Category</Label>
                    <Select
                        options={categoryOptions}
                        value={categoryOptions.find(o => o.value === form.category_id) || null}
                        onChange={(opt) => handleChange("category_id", opt?.value || "")}
                        isClearable
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label>Document Status</Label>
                    <Select
                        options={documentStatusOptions}
                        value={documentStatusOptions.find(o => o.value === form.document_status) || null}
                        onChange={(opt) => handleChange("document_status", opt?.value || "")}
                        isClearable
                        className="mt-2"
                    />
                </div> 

                {/* Date Range */}
                <div className="relative">
                    <Label>Created Date Range</Label>

                    {(form.from_date || form.to_date) && (
                        <button
                            onClick={() => {
                                rangeRef.current?.clear();
                                setForm(prev => ({
                                    ...prev,
                                    from_date: null,
                                    to_date: null
                                }));
                            }}
                            className="absolute right-2 top-9 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}

                    <div className="mt-2">
                        <DatePicker
                            ref={rangeRef}
                            id="document-date-range"
                            mode="range"
                            placeholder="Select date range"
                            onChange={(dates) => {
                                const [from, to] = dates;

                                setForm(prev => ({
                                    ...prev,
                                    from_date: helper.formatDate(from),
                                    to_date: helper.formatDate(to),
                                }));
                            }}
                        />
                    </div>
                </div>

                <div className="relative">
                    <Label>Updated Date Range</Label>

                    {(form.updated_from_date || form.updated_to_date) && (
                        <button
                            onClick={() => {
                                rangeRef.current?.clear();
                                setForm(prev => ({
                                    ...prev,
                                    updated_from_date: null,
                                    updated_to_date: null
                                }));
                            }}
                            className="absolute right-2 top-9 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}

                    <div className="mt-2">
                        <DatePicker
                            ref={rangeRef}
                            id="document-date-range"
                            mode="range"
                            placeholder="Select date range"
                            onChange={(dates) => {
                                const [from, to] = dates;

                                setForm(prev => ({
                                    ...prev,
                                    updated_from_date: helper.formatDate(from),
                                    updated_to_date: helper.formatDate(to),
                                }));
                            }}
                        />
                    </div>
                </div>

            </div>

        </div>
    );
});

export default DeepSearchFilter;