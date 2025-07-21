import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import CircularProgress from "@mui/material/CircularProgress";
import { ChevronDown } from "lucide-react";

const SmallChevronDown = forwardRef(function SmallChevronDown(props, ref) {
  const { style, ...other } = props;
  return (
    <ChevronDown
      ref={ref}
      width={20}
      height={20}
      style={{
        transition: "transform 0.2s",
        flex: "none",
        order: 1,
        flexGrow: 0,
        ...style,
      }}
      {...other}
    />
  );
});

const defaultInput = (
  <OutlinedInput
    sx={{
      borderRadius: "9999px",
      height: 40,
      background: "#fff",
      fontSize: 16,
      fontWeight: 500,
      "& .MuiOutlinedInput-notchedOutline": {
        borderRadius: "9999px !important",
      },
    }}
    inputProps={{ sx: { pl: 2.5 } }}
  />
);

const defaultDropdownSx = {
  borderRadius: "9999px",
  height: 40,
  width: 180,
  minWidth: 180,
  maxWidth: 220,
  background: "#fff",
  "& .MuiSelect-select": {
    borderRadius: "9999px !important",
    height: 40,
    display: "flex",
    alignItems: "center",
    padding: 0,
    paddingLeft: "20px !important",
    fontSize: 16,
    fontWeight: 500,
  },
  "& fieldset": {
    borderRadius: "9999px !important",
  },
};

const defaultMenuProps = {
  PaperProps: {
    sx: {
      borderRadius: 3,
      boxShadow: "0px 8px 32px rgba(0,0,0,0.16)",
      mt: 1,
      px: 1,
    },
  },
  MenuListProps: {
    sx: { py: 1 },
  },
};

const defaultMenuItemSx = {
  borderRadius: 9999,
  my: 0.5,
  px: 2.5,
  py: 1.2,
  fontSize: 16,
  fontWeight: 500,
  minHeight: 36,
  display: "flex",
  alignItems: "center",
  backgroundColor: "transparent !important",
  color: "inherit",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#F3F0FF",
    color: "#4D007D",
    fontWeight: 700,
    boxShadow: "0px 2px 8px rgba(124,58,237,0.08)",
  },
};

const Dropdown = forwardRef(function Dropdown(
  {
    options = [],
    value,
    onChange,
    multiple = false,
    displayEmpty = false,
    placeholder = "Select...",
    renderValue,
    renderOption,
    input,
    sx = {},
    MenuProps = {},
    IconComponent,
    menuItemSx = {},
    getOptionLabel = (option) =>
      typeof option === "object" ? option.label : option,
    getOptionValue = (option) =>
      typeof option === "object" ? option.value : option,
    className = "",
    dropdownClassName = "",
    disabled = false,
    error = false,
    loading = false,
    ...rest
  },
  ref
) {
  const defaultRenderValue = (selected) => {
    if (
      (multiple && (!selected || selected.length === 0)) ||
      (!multiple &&
        (selected === undefined || selected === null || selected === ""))
    ) {
      return <span style={{ color: "#aaa" }}>{placeholder}</span>;
    }
    if (multiple) {
      return selected
        .map((val) => {
          const opt = options.find((o) => getOptionValue(o) === val);
          return opt ? getOptionLabel(opt) : val;
        })
        .join(", ");
    } else {
      const opt = options.find((o) => getOptionValue(o) === selected);
      return opt ? getOptionLabel(opt) : selected;
    }
  };

  return (
    <Select
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      multiple={multiple}
      displayEmpty={displayEmpty || !!placeholder}
      renderValue={renderValue || defaultRenderValue}
      input={input || defaultInput}
      sx={{
        ...defaultDropdownSx,
        ...sx,
        "& .MuiSelect-icon": {
          transition: "transform 0.2s",
        },
        "&.Mui-expanded .MuiSelect-icon": {
          transform: "rotate(180deg)",
        },
      }}
      MenuProps={{
        ...defaultMenuProps,
        ...MenuProps,
        PaperProps: {
          ...defaultMenuProps.PaperProps,
          ...((MenuProps && MenuProps.PaperProps) || {}),
        },
        MenuListProps: {
          ...defaultMenuProps.MenuListProps,
          ...((MenuProps && MenuProps.MenuListProps) || {}),
        },
      }}
      IconComponent={IconComponent || SmallChevronDown}
      className={className + " " + dropdownClassName}
      disabled={disabled || loading}
      error={error}
      {...rest}
    >
      {loading ? (
        <MenuItem disabled sx={{ justifyContent: "center" }}>
          <CircularProgress size={20} />
        </MenuItem>
      ) : options.length === 0 ? (
        <MenuItem disabled>No options</MenuItem>
      ) : (
        options.map((option, idx) => (
          <MenuItem
            key={getOptionValue(option) ?? idx}
            value={getOptionValue(option)}
            sx={{ ...defaultMenuItemSx, ...menuItemSx }}
            disabled={option.disabled}
          >
            {renderOption ? renderOption(option) : getOptionLabel(option)}
          </MenuItem>
        ))
      )}
    </Select>
  );
});

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  displayEmpty: PropTypes.bool,
  placeholder: PropTypes.node,
  renderValue: PropTypes.func,
  renderOption: PropTypes.func,
  input: PropTypes.node,
  sx: PropTypes.object,
  MenuProps: PropTypes.object,
  IconComponent: PropTypes.elementType,
  menuItemSx: PropTypes.object,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  loading: PropTypes.bool,
};

export default Dropdown;
