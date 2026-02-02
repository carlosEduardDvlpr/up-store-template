"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Color } from "@/data/types/colors";
import { Size } from "@/data/types/sizes";
import {
  colorsListWithAvailableProducts,
  sizesListWithAvailableProducts,
} from "@/lib/database";

const productFiltersSchema = z.object({
  q: z.string().max(100).optional(),
  colorCodes: z.array(z.string()).optional(),
  sizeCodes: z.array(z.string()).optional(),
  is_promo: z.boolean().optional(),
});
type ProductFiltersSchema = z.infer<typeof productFiltersSchema>;

interface FilterOption {
  id: "q" | "colorCodes" | "sizeCodes";
  name: string;
  options: {
    value: string;
    label: string;
    backgroundColor?: string;
    product_count?: number; // Optional product_count for categories, sizes, etc.
  }[];
}

export function ProductCatalogFilters({
  count,
  path,
}: {
  count: number;
  path: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q");
  const colorCodes = searchParams.get("colorCodes")?.split(",");
  const sizeCodes = searchParams.get("sizeCodes")?.split(",");
  const is_promo = searchParams.get("is_promo") === "true";

  const { control, handleSubmit, setValue, reset, register } =
    useForm<ProductFiltersSchema>({
      resolver: zodResolver(productFiltersSchema),
      defaultValues: {
        q: q ?? "",
        colorCodes: colorCodes ?? [],
        sizeCodes,
        is_promo: is_promo || false,
      },
    });

  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [optionsSearch, setOptionsSearch] = useState<Record<string, string>>(
    {},
  );
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({});
  const [selectedCounts, setSelectedCounts] = useState<Record<string, number>>(
    {},
  );

  const filterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    let alive = true;

    Promise.all([
      colorsListWithAvailableProducts(),
      sizesListWithAvailableProducts(),
    ])
      .then(([colors, sizes]) => {
        if (!alive) return;

        setFilters([
          {
            id: "colorCodes",
            name: "CORES",
            options: colors.map((color: Color) => ({
              value: color.code,
              label: color.title,
              backgroundColor: color.background_color,
              product_count: color.product_count,
            })),
          },
          {
            id: "sizeCodes",
            name: "TAMANHOS",
            options: sizes.map((size: Size) => ({
              value: size.code,
              label: size.title,
              product_count: size.product_count,
            })),
          },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching filters:", error);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        const ref = filterRefs.current[dropdownOpen];
        if (ref && !ref.contains(event.target as Node)) {
          setDropdownOpen(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Update selected counts when form values change
  useEffect(() => {
    const updateSelectedCounts = () => {
      const counts: Record<string, number> = {};
      filters.forEach((filter) => {
        const values = control._formValues[filter.id];
        counts[filter.id] = Array.isArray(values) ? values.length : 0;
      });
      setSelectedCounts(counts);
    };
    updateSelectedCounts();
  }, [control._formValues, filters]);

  function handleFilter(data: ProductFiltersSchema) {
    const params = new URLSearchParams();
    if (data.q) {
      params.set("q", data.q);
    }
    if (data.colorCodes?.length) {
      params.set("colorCodes", data.colorCodes.toString());
    } else {
      params.delete("colorCodes");
    }
    if (data.sizeCodes?.length) {
      params.set("sizeCodes", data.sizeCodes.toString());
    } else {
      params.delete("sizeCodes");
    }

    if (data.is_promo) {
      params.set("is_promo", "true");
    } else {
      params.delete("is_promo");
    }
    router.push(`${path}?${params.toString()}`);
    setFiltersOpen(false);
  }

  function handleReset() {
    reset({
      q: "",
      colorCodes: [],
      sizeCodes: [],
      is_promo: false,
    });
    router.push(path);
    setFiltersOpen(false);
  }

  // Filter options based on search term
  const getFilteredOptions = (filter: FilterOption) => {
    const searchTerm = optionsSearch[filter.id] || "";
    if (!searchTerm) return filter.options;

    return filter.options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  // New function to sort options by selection status
  const getSortedOptions = (
    filter: FilterOption,
    options: typeof filter.options,
  ) => {
    const selectedValues = Array.isArray(control._formValues[filter.id])
      ? control._formValues[filter.id]
      : [];

    return [...options].sort((a, b) => {
      const aSelected = selectedValues.includes(a.value);
      const bSelected = selectedValues.includes(b.value);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  };

  // Get visible options for a filter (first 10 or all if expanded)
  const getVisibleOptions = (filter: FilterOption) => {
    const filteredOptions = getFilteredOptions(filter);
    const sortedOptions = getSortedOptions(filter, filteredOptions);
    const isExpanded = expandedFilters[filter.id];
    return isExpanded ? sortedOptions : sortedOptions.slice(0, 10);
  };

  // Get selected count for a filter
  const getSelectedCount = (filterId: string) => {
    return selectedCounts[filterId] || 0;
  };

  // Toggle expanded state for a filter
  const toggleExpanded = (filterId: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };

  // Check if a filter has more options to show
  const hasMoreOptions = (filter: FilterOption) => {
    return getFilteredOptions(filter).length > 10;
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <div className="flex justify-between font-light uppercase w-full md:w-[100vw] p-3 border-t-[1.5px] border-x-[1.5px] border-gray-600 text-xs md:text-base">
        <span>{count} produto(s)</span>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 font-medium"
        >
          <FilterIcon className="w-5 h-5" />
          FILTRAR
        </button>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap lg:pr-3"
        >
          Ordernar por
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform active:rotate-180`}
          />
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white md:right-1/2"
          >
            <div className="flex flex-col h-full border-[1.5px] border-gray-600">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-medium">FILTRAR</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="text-gray-500"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Search Input */}
                <div className="border-b p-2">
                  <input
                    type="text"
                    placeholder={q ?? "Pesquisar..."}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500 w-full h-full px-4 py-2 border-0 focus:border-0 focus:ring-0"
                    {...register("q")}
                  />
                </div>

                {/* Filters */}
                {filters.map((filter) => (
                  <div
                    key={filter.id}
                    className="pt-3 px-2 border-b cursor-pointer hover:bg-gray-100 p-2 rounded-sm transition-colors"
                  >
                    <div
                      className="flex justify-between items-center mb-2"
                      onClick={() => {
                        if (dropdownOpen === filter.id) {
                          setDropdownOpen(null);
                          setExpandedFilters((prev) => ({
                            ...prev,
                            [filter.id]: false,
                          }));
                        } else {
                          setDropdownOpen(filter.id);
                        }
                      }}
                    >
                      <h3 className="font-medium">{filter.name}</h3>
                      <div className="flex items-center gap-2">
                        {getSelectedCount(filter.id) > 0 && (
                          <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                            {getSelectedCount(filter.id)}
                          </span>
                        )}
                        <ChevronDownIcon
                          className={`h-5 w-5 transition-transform ${dropdownOpen === filter.id ? "rotate-180" : ""
                            }`}
                        />
                      </div>
                    </div>

                    {/* Search input for filter options */}
                    <AnimatePresence>
                      {dropdownOpen === filter.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="mb-4 ">
                            <input
                              type="text"
                              placeholder="Buscar..."
                              className="w-full p-2 border rounded-sm"
                              value={optionsSearch[filter.id] || ""}
                              onChange={(e) =>
                                setOptionsSearch({
                                  ...optionsSearch,
                                  [filter.id]: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Filter Options */}
                          <div className="grid grid-cols-2 gap-2 md:gap-4">
                            {getVisibleOptions(filter).map((option) => (
                              <motion.div
                                key={option.value}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Controller
                                  name={filter.id}
                                  control={control}
                                  render={({ field }) => {
                                    const selectedValues = Array.isArray(
                                      field.value,
                                    )
                                      ? field.value
                                      : [];
                                    const isSelected = selectedValues.includes(
                                      option.value,
                                    );

                                    return (
                                      <div
                                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${isSelected
                                            ? "bg-black text-white"
                                            : "bg-white hover:bg-gray-100"
                                          }`}
                                        onClick={() => {
                                          const newValues = isSelected
                                            ? selectedValues.filter(
                                              (v) => v !== option.value,
                                            )
                                            : [...selectedValues, option.value];
                                          setValue(filter.id, newValues, {
                                            shouldDirty: true,
                                          });
                                          // Update selected counts immediately
                                          setSelectedCounts((prev) => ({
                                            ...prev,
                                            [filter.id]: newValues.length,
                                          }));
                                        }}
                                      >
                                        {option.backgroundColor && (
                                          <span
                                            className={`w-6 h-6 border rounded ${isSelected ? "border-white" : ""
                                              }`}
                                            style={{
                                              backgroundColor:
                                                option.backgroundColor,
                                            }}
                                          />
                                        )}
                                        <span className="text-sm">
                                          {option.label}
                                        </span>
                                        {option.product_count && (
                                          <span
                                            className={`text-xs ${isSelected
                                                ? "text-gray-300"
                                                : "text-gray-500"
                                              }`}
                                          >
                                            ({option.product_count})
                                          </span>
                                        )}
                                      </div>
                                    );
                                  }}
                                />
                              </motion.div>
                            ))}
                          </div>

                          {/* Show More/Less Button */}
                          {hasMoreOptions(filter) && (
                            <div className="my-4 text-center">
                              <button
                                onClick={() => toggleExpanded(filter.id)}
                                className="text-sm text-gray-600 hover:text-black transition-colors"
                              >
                                {expandedFilters[filter.id]
                                  ? "Mostrar menos"
                                  : "Mostrar mais"}
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t flex gap-4">
                <button
                  onClick={handleSubmit(handleReset)}
                  className="flex-1 p-3 text-center border border-black hover:bg-gray-100"
                >
                  LIMPAR
                </button>
                <button
                  onClick={handleSubmit(handleFilter)}
                  className="flex-1 p-3 text-center text-white bg-black hover:bg-gray-900"
                >
                  APLICAR
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
